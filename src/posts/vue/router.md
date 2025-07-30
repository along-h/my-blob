---
date: 2023-09-03
category:
  - vue
tag:
  - 源码
---
vue-router相关配置

<!-- more -->

# Vue-router

### query与params区别

query是查询参数，如goods?id=123，此时及时没有传id，页面也不该崩掉
params(动态路由)是写在路径中，params/123，此时不传id，页面会崩

## 1. 动态路由参数

### 1.1 基本使用

```
const User = {
  template: '<div>User</div>',
}

// 这些都会传递给 `createRouter`
const routes = [
  // 动态字段以冒号开始
  { path: '/users/:id', component: User },
]
// /users/johnny 和 /users/jolyne 这样的 URL 都会映射到同一个路由。
// 用冒号 : 表示。当一个路由被匹配时，它的 params 的值将在每个组件中以 this.$route.params 的形式暴露出来。
// 因此，我们可以通过更新 User 的模板来呈现当前的用户 ID

const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}
```

### 1.2 监听参数变化

1. watch监听

```
const User = {
  template: '...',
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // 对路由变化做出响应...
      }
    )
  },
}
```

```
2. 导航守卫
```

```
const User = {
  template: '...',
  async beforeRouteUpdate(to, from) {
    // 对路由变化做出响应...
    this.userData = await fetchUser(to.params.id)
  },
}
```

## 2. 路由的匹配语法

定义像 `:userId` 这样的参数时，我们内部使用以下的正则 `([^/]+)` (至少有一个字符不是斜杠 `/` )来从 URL 中提取参数。这很好用，除非你需要根据参数的内容来区分两个路由。想象一下，两个路由 `/:orderId` 和 `/:productName`，两者会匹配完全相同的 URL，所以我们需要一种方法来区分它们。最简单的方法就是在路径中添加一个静态部分来区分它们：

```
const routes = [
  // 匹配 /o/3549
  { path: '/o/:orderId' },
  // 匹配 /p/books
  { path: '/p/:productName' },
]
```

但在某些情况下，我们并不想添加静态的 `/o``/p` 部分。由于，`orderId` 总是一个数字，而 `productName` 可以是任何东西，所以我们可以在括号中为参数指定一个自定义的正则：

```
const routes = [
  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },
  // /:productName -> 匹配其他任何内容
  { path: '/:productName' },
]
```

默认情况下，所有路由是不区分大小写的，并且能匹配带有或不带有尾部斜线的路由。例如，路由 `/users` 将匹配 `/users`、`/users/`、甚至 `/Users/`。这种行为可以通过 `strict` 和 `sensitive` 选项来修改，它们可以既可以应用在整个全局路由上，又可以应用于当前路由上：

```
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users/posva 而非：
    // - /users/posva/ 当 strict: true
    // - /Users/posva 当 sensitive: true
    { path: '/users/:id', sensitive: true },
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: '/users/:id?' },
  ],
  strict: true, // applies to all routes
})

const routes = [
  // 匹配 /users 和 /users/posva
  { path: '/users/:userId?' },
  // 匹配 /users 和 /users/42
  { path: '/users/:userId(\\d+)?' },
]
```

可以通过使用 `?` 修饰符(0 个或 1 个)将一个参数标记为可选

```
const routes = [
  // 匹配 /users 和 /users/posva
  { path: '/users/:userId?' },
  // 匹配 /users 和 /users/42
  { path: '/users/:userId(\\d+)?' },
]
```

## 3. 嵌套路由

### 3.1 基本使用

```
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `,
}

const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

### 3.2 命名路由

```
const routes = [
  {
    path: '/user/:id',
    component: User,
    // 请注意，只有子路由具有名称
    children: [{ path: '', name: 'user', component: UserHome }],
  },
]

this.$router.push({name: 'user'})
```

## 4. 编程式导航

当你点击 `<router-link>` 时，内部会调用这个方法，所以点击 `<router-link :to="...">` 相当于调用 `router.push(...)`

```
const username = 'eduardo'
// 我们可以手动建立 url，但我们必须自己处理编码
router.push(`/user/${username}`) // -> /user/eduardo
// 同样
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// 如果可能的话，使用 `name` 和 `params` 从自动 URL 编码中获益
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
// `params` 不能与 `path` 一起使用
router.push({ path: '/user', params: { username } }) // -> /user

// 替换当前路由位置
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```

## 5. 重定向和别名

### 5.1 重定向(会发生路由跳转)

重定向也是通过 `routes` 配置来完成，可以是字符串也能是对象，也能是函数

```
const routes = [{ path: '/home', redirect: '/' }]

const routes = [{ path: '/home', redirect: { name: 'homepage' } }]

const routes = [
  {
    // /search/screens -> /search?q=screens
    path: '/search/:searchText',
    redirect: to => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: '/search', query: { q: to.params.searchText } }
    },
  },
]
```

定位到相对重定向

```
const routes = [
  {
    // 将总是把/users/123/posts重定向到/users/123/profile。
    path: '/users/:id/posts',
    redirect: to => {
      // 该函数接收目标路由作为参数
      // 相对位置不以`/`开头
      // 或 { path: 'profile'}
      return 'profile'
    },
  },
]
```

### 5.2 别名(不会发生路由跳转)

```
const routes = [
  {
    path: '/goods/:id',
    name: 'goodsDetail',
    component: GoodsDetail,
    alias: '/goodsDetail/:id'
  }
]
```

## 6. 命名视图(多个routerView)

```
<div>
  // 默认name为default
  <router-view></router-view>
  <router-view name="menu"></router-view>
</div>
```

路由配置为components(带s，为对象)

```
const routes = [
  {
    path: 'goods/:id',
    components: {
      menu: Menu,
      default: GoodsDetail
    }
  }
]
```

## 7. 路由模式

### 7.1 Hash模式

它在内部传递的实际 URL 之前使用了一个哈希字符（`#`）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。不过，它在 SEO 中确实有不好的影响。

```
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

原理：监听hashchange事件，根据得到的hash值匹配相应的组件进行展示。

```
// 监听URL的改变
window.addEventListener("hashchange", () => {
  switch (location.hash) {
    case "#/home":
      routerViewEl.innerHTML = "首页";
      break;
    case "#/about":
      routerViewEl.innerHTML = "关于";
      break;
    default:
      routerViewEl.innerHTML = "";
  }
})
```

### 7.2 html5模式

当使用这种历史模式时，URL 会看起来很 "正常"，但是由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 `https://example.com/user/id`，就会得到一个 404 错误。刷新的时候会向服务发起请求

```
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

原理：

history模式：利用h5 Api实现路由切换
包括两个方法：history.pushState和history.replaceState
一个事件：window.onpopstate

window.onpopstate能监听到浏览器的前进后退，go，forward,back，但是监听不到history.pushState和history.replaceState方法，此时需要手动调用render函数

### 7.3 内存模式(客户端不用，后端渲染)

```
import {createRouter, createMemoryHistory} from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

## 8. 导航守卫

### 8.1 生命周期

1. **导航被触发。**
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 8.2 全局前置守卫

```
const router = createRouter({ ... })

router.beforeEach((to, from, next) => {
  // to: next route对象
  // from: current route对象
  // next: 继续往下执行
  // 返回 false 以取消导航
  if(user.isAuth) {
    next()
  } else {
    return false
  }
})
```

### 8.3 全局解析守卫

解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。

```
router.beforeResolve(async (to, from ,next) => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

### 8.4 全局后置钩子

跳转后，钩子不会接受 `next` 函数也不会改变导航本身

```
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

### 8.5 路由独享守卫

```
const router = createRouter({
  routes: [
    {
      path: '/users',
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

### 8.6组件内钩子函数

```
export default {
  // 刚进去时，组件还没渲染
  beforeRouterEnter(to, from ,next) {
    // 可以传入回调函数,访问组件实例
    next(vm => {
      console.log(vm)
    })
  },
  // 路由更新时
  beforeRouterUpdate(to, from ,next) {
    
  },
  // 离开时
  beforeRouterLeave(to, from ,next) {
    
  }
}
```

### 8.7 数据获取

1. **导航完成后获取**
   ```
   export default {
     created() {
       this.$watch(this.$route.params, () => {
         // 获取数据
       })
     }
   }
   ```
2. **导航完成前获取**
   ```
   export default {
     beforeRouterEnter() {
       // 获取数据
     }
   }
   ```

### 8.8 路由懒加载

```
const router = {
  routes: [
    {
      path: '/users',
      component: () => import('../views/Users.vue')
    }
  ]
}
```

### 8.9 导航故障

当使用 `router-link` 组件时，Vue Router 会自动调用 `router.push` 来触发一次导航。虽然大多数链接的预期行为是将用户导航到一个新页面，但也有少数情况下用户将留在同一页面上：

* **用户已经位于他们正在尝试导航到的页面**
* 一个导航守卫通过调用 `return false` 中断了这次导航
* 当前的导航守卫还没有完成时，一个新的导航守卫会出现了
* 一个导航守卫通过返回一个新的位置，重定向到其他地方 (例如，`return '/login'`)
* 一个导航守卫抛出了一个 `Error`

```
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // 导航被阻止
} else {
  // 导航成功 (包括重新导航的情况)
  this.isMenuOpen = false
}
```

*Navigation Failure* 是带有一些额外属性的 `Error` 实例，这些属性为我们提供了足够的信息，让我们知道哪些导航被阻止了以及为什么被阻止了。要检查导航结果的性质，请使用 `isNavigationFailure` 函数：

```
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// 试图离开未保存的编辑文本界面
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 给用户显示一个小通知
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

NavigationFailureType总共有三种不同的类型：

* `aborted`：在导航守卫中返回 `false` 中断了本次导航。
* `cancelled`： 在当前导航还没有完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 `router.push`。
* `duplicated`：导航被阻止，因为我们已经在目标位置了。

## 9. 手写vueRouter(vue-router3)

```
//myVueRouter.js
let Vue = null;
class HistoryRoute {
    constructor() {
        this.current = null;
    }
}
class VueRouter {
    constructor(options) {
        this.mode = options.mode || 'hash';
        this.routes = options.routes || []; //你传递的这个路由是一个数组表
        this.routesMap = this.createMap(this.routes);
        this.history = new HistoryRoute();
        this.init();
    }
    init() {
        if (this.mode === 'hash') {
            // 先判断用户打开时有没有hash值，没有的话跳转到#/
            location.hash ? '' : (location.hash = '/');
            window.addEventListener('load', () => {
                this.history.current = location.hash.slice(1);
            });
            window.addEventListener('hashchange', () => {
                this.history.current = location.hash.slice(1);
            });
        } else {
            location.pathname ? '' : (location.pathname = '/');
            window.addEventListener('load', () => {
                this.history.current = location.pathname;
            });
            window.addEventListener('popstate', () => {
                this.history.current = location.pathname;
            });
        }
    }

    createMap(routes) {
        return routes.reduce((pre, current) => {
            pre[current.path] = current.component;
            return pre;
        }, {});
    }
}
VueRouter.install = function (v) {
    Vue = v;
    Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.router) {
                // 如果是根组件
                this._root = this; //把当前实例挂载到_root上
                this._router = this.$options.router;
                Vue.util.defineReactive(this, 'xxx', this._router.history);
            } else {
                //如果是子组件
                this._root = this.$parent && this.$parent._root;
            }
            Object.defineProperty(this, '$router', {
                get() {
                    return this._root._router;
                },
            });
            Object.defineProperty(this, '$route', {
                get() {
                    return this._root._router.history.current;
                },
            });
        },
    });
    Vue.component('router-link', {
        props: {
            to: String,
        },
        render(h) {
            let mode = this._self._root._router.mode;
            let to = mode === 'hash' ? '#' + this.to : this.to;
            return h('a', { attrs: { href: to } }, this.$slots.default);
        },
    });
    Vue.component('router-view', {
        render(h) {
            let current = this._self._root._router.history.current;
            let routeMap = this._self._root._router.routesMap;
            return h(routeMap[current]);
        },
    });
};

export default VueRouter;
```

## 10. SSR(服务端渲染)

### 10.1 优势：

1. 方便SEO
2. 白屏时间更短
   相对于客户端渲染，服务端渲染在浏览器请求URL之后已经得到了一个带有数据的HTML文本，浏览器只需要解析HTML，直接构建DOM树就可以。而客户端渲染，需要先得到一个空的HTML页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。

### 10.2 缺点：

1. 代码复杂度增加。为了实现服务端渲染，应用代码中需要兼容服务端和客户端两种运行情况，而一部分依赖的外部扩展库却只能在客户端运行，需要对其进行特殊处理，才能在服务器渲染应用程序中运行。
2. 需要更多的服务器负载均衡。由于服务器增加了渲染HTML的需求，使得原本只需要输出静态资源文件的nodejs服务，新增了数据获取的IO和渲染HTML的CPU占用，如果流量突然暴增，有可能导致服务器down机，因此需要使用响应的缓存策略和准备相应的服务器负载。
3. 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。

### 10.3 基础SSR应用

**核心使用** `createSSRApp`和 `express`实现

```
import { createSSRApp } from 'vue';
import express from 'express';
import { renderToString } from 'vue/server-renderer';

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<div @click="count++">{{ count }}</div>`,
  });
}

const server = express();

server.get('/', (req, res) => {
  const app = createApp();

  renderToString(app).then(html => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
        <script type="importmap">
          {
            "imports": {
              "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
            }
          }
        </script>
        <script type="module" src="/client.js"></script>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `);
  });
});

server.use(express.static('.'));

server.listen(3000, () => {
  console.log('ready');
});
```

### 10.3 Vue常见方案

1. Nuxt
2. Quasar
3. Vite SSR

同构：服务端执行一次、客户端执行一次
