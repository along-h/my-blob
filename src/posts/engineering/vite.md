---
date: 2024-10-16
category:
  - vite
---
vite概念

<!-- more -->

# Vite

## 特性

- 开发环境冷启动，无需打包（比webpack快的原因）
- 利用ESM和浏览器缓存技术，优化了HMR，使其更新速度与项目复杂度无关，只会请求当前模块下的资源
- 配置较webpack简单

## 原理

### 开发环境

​ `Vite`相比于`Webpack`而言，没有打包的过程，而是直接启动了一个开发服务器devServer。`Vite`劫持浏览器的`HTTP`请求，在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再返回给浏览器(整个过程没有对文件进行打包编译)。所以编译速度很快。

​ 使用`esbuild`对依赖进行预构建，将`CommonJS`和`UMD`发布的依赖转换为浏览器支持的`ESM`，并且会将依赖缓存至`node_modules/.vite/dep`下，后续直接引用，会根据`packages.json`的的`dependencies`列表、包管理器的`lockfile`、可能在`vite.config.js`相关字段中配置过的。只要三者之一发生改变，才会重新预构建。

同时利用浏览器的缓存技术，解析后的依赖请求以http头的`max-age=31536000,immutable`进行强缓存，以提高性能

#### 1. 依赖处理

##### 1.1 依赖预构建

​ 依赖预构建主要有两个目的：

- **CommonJS 和 UMD 兼容性:** 开发阶段中，Vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将作为 CommonJS 或 UMD 发布的依赖项转换为 ESM。
- **性能：** Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。

##### 1.2 静态资源加载

​ 当请求的路径符合 imageRE, mediaRE, fontsRE 或 JSON 格式，会被认为是一个静态资源。静态资源将处理成ESM模块返回。

```js
// src/node/utils/pathUtils.ts
const imageRE = /\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/
const mediaRE = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
const fontsRE = /\.(woff2?|eot|ttf|otf)(\?.*)?$/i
export const isStaticAsset = (file: string) => {
  return imageRE.test(file) || mediaRE.test(file) || fontsRE.test(file)
}

// src/node/server/serverPluginAssets.ts
app.use(async (ctx, next) => {
  if (isStaticAsset(ctx.path) && isImportRequest(ctx)) {
    ctx.type = 'js'
    ctx.body = export default ${JSON.stringify(ctx.path)} // 输出是path
    return
  }
  return next()
})

export const jsonPlugin: ServerPlugin = ({ app }) => {
  app.use(async (ctx, next) => {
    await next()
    // handle .json imports
    // note ctx.body could be null if upstream set status to 304
    if (ctx.path.endsWith('.json') && isImportRequest(ctx) && ctx.body) {
      ctx.type = 'js'
      ctx.body = dataToEsm(JSON.parse((await readBody(ctx.body))!), {
        namedExports: true,
        preferConst: true
      })
    }
  })
}
```

##### 1.3 **vue**处理

当 Vite 遇到一个 .vue 后缀的文件时。由于 .vue 模板文件的特殊性，它被拆分成 template, css, script 模块三个模块进行分别处理。最后会对 script, template, css 发送多个请求获取

##### 1.4 **js/ts处理**

Vite使用esbuild将ts转译到js，约是tsc速度的20～30倍，将ts转换成js后，浏览器便可以利用ESM直接拿到js资源。

#### 2. 热更新原理

​ 其实就是在客户端与服务端建立了一个 websocket 连接，当代码被修改时，服务端发送消息通知客户端去请求修改模块的代码，完成热更新。

- 服务端：服务端做的就是监听代码文件的改变，在合适的时机向客户端发送 websocket 信息通知客户端去请求新的模块代码。
- 客户端：Vite 中客户端的 websocket 相关代码在处理 html 中时被写入代码中。可以看到在处理 html 时，vite/client 的相关代码已经被插入。

​ 在 `Vite`` dev server` 启动之前，`Vite` 会为 `HMR` 做一些准备工作：比如创建`websocket`服务，利用`chokidar`创建一个监听对象 `watcher` 用于对文件修改进行监听等等

```js
// 源码位置：packages/vite/src/node/server/index.ts
export async function createServer(
  inlineConfig: InlineConfig = {}
): Promise<ViteDevServer> {
  ....
  const ws = createWebSocketServer(httpServer, config, httpsOptions)
  const { ignored = [], ...watchOptions } = serverConfig.watch || {}
  const watcher = chokidar.watch(path.resolve(root), {
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      ...(Array.isArray(ignored) ? ignored : [ignored])
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
    ...watchOptions
  }) as FSWatcher
  ....
  watcher.on('change', async (file) => {

  })
  watcher.on('add', (file) => {
  })
  watcher.on('unlink', (file) => {
  })
  ...
  return server
}
```

​ `createWebSocketServer`这个方法主是创建`WebSocket`服务并对错误进行一些处理，最后返回封装好的`on`、`off`、 `send` 和 `close` 方法，用于后续服务端推送消息和关闭服务。

```js
// 源码位置：packages/vite/src/node/server/ws.ts
export function createWebSocketServer(
  server: Server | null,
  config: ResolvedConfig,
  httpsOptions?: HttpsServerOptions
): WebSocketServer {
  let wss: WebSocket
  let httpsServer: Server | undefined = undefined
  // 热更新配置
  const hmr = isObject(config.server.hmr) && config.server.hmr
  const wsServer = (hmr && hmr.server) || server
  // 普通模式
  if (wsServer) {
    wss = new WebSocket({ noServer: true })
    wsServer.on('upgrade', (req, socket, head) => {
      // 监听通过vite客户端发送的websocket消息，通过HMR_HEADER区分
      if (req.headers['sec-websocket-protocol'] === HMR_HEADER) {
        wss.handleUpgrade(req, socket as Socket, head, (ws) => {
          wss.emit('connection', ws, req)
        })
      }
    })
  } else { // 中间件模式
    // vite dev server in middleware mode
    wss = new WebSocket(websocketServerOptions)
  }
  wss.on('connection', (socket) => {
    ...
  })
  // 错误处理
  wss.on('error', (e: Error & { code: string }) => {
    ...
  })
  // 返回
  return {
    on: wss.on.bind(wss),
    off: wss.off.bind(wss),
    send(payload: HMRPayload) {
      ...
    },
    close() {
      ...
    }
  }
}
```

### 生产环境

​ `Rollup`是基于`ESM`的`JavaScript`打包工具。相比于其他打包工具如`Webpack`，他总是能打出更小、更快的包。因为 `Rollup` 基于 `ESM` 模块，比 `Webpack` 和 `Browserify` 使用的 `CommonJS`模块机制更高效。`Rollup`的亮点在于同一个地方，一次性加载。能针对源码进行 `Tree Shaking`(去除那些已被定义但没被使用的代码)，以及 `Scope Hoisting` 以减小输出文件大小提升运行性能。

​ `Rollup`分为`build`（构建）阶段和`output generate`（输出生成）阶段。主要过程如下：

- 获取入口文件的内容，包装成`module`，生成抽象语法树
- 对入口文件抽象语法树进行依赖解析
- 生成最终代码
- 写入目标文

​ 在生产环境，由于嵌套导入会导致发送大量的网络请求，即使使用HTTP2.x（多路复用、首部压缩），在生产环境中发布未打包的ESM仍然性能低下。因此，对比在开发环境Vite使用esbuild来构建依赖，生产环境Vite则使用了更加成熟的Rollup来完成整个打包过程。因为esbuild虽然快，但针对应用级别的代码分割、CSS处理仍然不够稳定，同时也未能兼容一些未提供ESM的SDK。

## 插件

### 本质

插件的本质其实就是一个函数，返回了一个对象，包含name、options、resolveId等钩子

#### 常用钩子

在开发中，Vite 开发服务器会创建一个插件容器来调用 [Rollup 构建钩子](https://rollupjs.org/plugin-development/#build-hooks)，与 Rollup 如出一辙。

以下钩子在服务器启动时被调用：

- [`options`](https://rollupjs.org/plugin-development/#options)
- [`buildStart`](https://rollupjs.org/plugin-development/#buildstart)

以下钩子会在每个传入模块请求时被调用：

- [`resolveId`](https://rollupjs.org/plugin-development/#resolveid)
- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

以下钩子在服务器关闭时被调用：

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

vite独有钩子：

- config：在解析 Vite 配置前调用。钩子接收原始用户配置（命令行选项指定的会与配置文件合并）和一个描述配置环境的变量，包含正在使用的 `mode` 和 `command`。它可以返回一个将被深度合并到现有配置中的部分配置对象，或者直接改变配置（如果默认的合并不能达到预期的结果）
- configResolved：在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。
- configureServer：是用于配置开发服务器的钩子。最常见的用例是在内部 [connect](https://github.com/senchalabs/connect) 应用程序中添加自定义中间件:
- configurePreviewServer：与 [`configureServer`](https://cn.vitejs.dev/guide/api-plugin.html#configureserver) 相同，但用于预览服务器。`configurePreviewServer` 这个钩子与 `configureServer` 类似，也是在其他中间件安装前被调用。如果你想要在其他中间件 **之后** 安装一个插件，你可以从 `configurePreviewServer` 返回一个函数，它将会在内部中间件被安装之后再调用
- transformIndexHtml：转换HTML专用钩子
- handleHotUpdate：执行自定义 HMR 更新处理。钩子接收一个带有以下签名的上下文对象

```

```

### 命名方式

如果插件不使用 Vite 特有的钩子，可以作为 [兼容 Rollup 的插件](https://cn.vitejs.dev/guide/api-plugin#rollup-plugin-compatibility) 来实现，推荐使用 [Rollup 插件名称约定](https://rollupjs.org/plugin-development/#conventions)。

- Rollup 插件应该有一个带 `rollup-plugin-` 前缀、语义清晰的名称。
- 在 package.json 中包含 `rollup-plugin` 和 `vite-plugin` 关键字。

对于 Vite 专属的插件：

- Vite 插件应该有一个带 `vite-plugin-` 前缀、语义清晰的名称。
- 在 package.json 中包含 `vite-plugin` 关键字。
- 在插件文档增加一部分关于为什么本插件是一个 Vite 专属插件的详细说明（如，本插件使用了 Vite 特有的插件钩子）。

```
