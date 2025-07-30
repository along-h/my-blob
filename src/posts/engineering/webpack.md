---
date: 2024-11-02
category:
  - webpack
---
webpack概念

<!-- more -->

# webpack

前端资源文件类型十分丰富、vue、ts、img、css、less等，但是浏览器只能加载其中一部分，所

## 基本模块

- entry： 入口
- output： 出口
- mode： 根据rule匹配文件，并根据相应的loader处理文件
- plugin：插件类
- loader： 处理文件的函数

## 重要对象

### complier

webpack的全局对象，上面挂载着webpack的钩子

### complilation

当前的编译内容

## Loader

实质上是一个函数

## Plugin

实质上是一个class类，里面有个apply方法，apply方法接收complier，可以通过complier上面的一系列钩子进行处理。这些钩子本质上是通过tabpable进行实现的。

## webpack5特性

- 自动引用polyfills，配置browser，继承了preset-env，自动添加
- 对于确定的chunk、模块ID和导出名称新增了长期缓存的算法。这些算法在生产模式下是默认启用的。
- 支持tree-shaking，Webpack 4 没有分析模块的导出和引用之间的依赖关系。webpack 5 有一个新的选项 `optimization.innerGraph`，在生产模式下是默认启用的，它可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。
- Webpack 5 增加了对一些 CommonJs 构造的支持，允许消除未使用的 CommonJs 导出，并从 `require()` 调用中跟踪引用的导出名称。
- webpack 所使用的监听已重构。它之前使用的是 `chokidar` 和原生依赖 `fsevents`（仅在 macOS 上）。现在它在只基于原生的 Node.js 中的 `fs`。这意味着在 webpack 中已经没有原生依赖了。

## 优化

### DllPlugin

配置dllplugin，将不常更新的第三方库进行打包缓存，生成`manifest.json`文件后续打包时不再对这些包进行编译，直接走缓存去提高打包速度

### thread-loader

编译js时，可以开启多个线程进行解析，从而提高打包速度

### MiniCssExarctPlugin

会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

### compression-webpack-plugin

开启Gzip，压缩文件代码（js、css、等等）需要服务器也开启gzip

### 启动CDN

对于一些确定版本的可以采用CDN的方式，如框架vue、react、ui版本，并将其排除在打包中

### 对文件名启用hash

`fullhash` 、`chunkhash`、`contenthash`

- fullhash：每次webpack构建时生成一个唯一的hash值，一次打包只有一个

- chunkhash：根据chunk生成hash值，来源于同一个chunk，则hash值就一样，常用于入口文件的配置

- contenthash：根据内容生成hash值，文件内容相同hash值就相同

```js
module.exports = {
 output: {
  filename: '[name].[fullhash].js'
 }
}
```

```
