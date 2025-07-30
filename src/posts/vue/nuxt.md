---
date: 2024-12-21
category:
  - vue
---
nuxt基本使用

<!-- more -->

# Nuxt

## 目录结构

​ 定义在目录中的数据，nuxt会自动注册，可以直接引入

### assets

​ 放全局的公共资源，img等

### components

​ 公共组件

### composables/utils

公共hooks/方法，可以直接调用

### content

### layouts

​ 布局组件，会直接引入，可以自定义页面使用definePageMeta来决定使用哪个layout

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'custom'
})
</script>
```

​ 另外假如有多层目录结构的话建议命名方式一致

|                  file                  |   layoutName    |
| :------------------------------------: | :-------------: |
|  ~/layouts/desktop/DesktopDefault.vue  | desktop-default |
| ~/layouts/desktop-base/DesktopBase.vue |  desktop-base   |
|     ~/layouts/desktop/Desktop.vue      |     desktop     |

​ 否则的话会将重复的给去除掉

|              file               |   layoutName    |
| :-----------------------------: | :-------------: |
|  ~/layouts/desktop/default.vue  | desktop-default |
| ~/layouts/desktop-base/base.vue |  desktop-base   |
|   ~/layouts/desktop/index.vue   |     desktop     |

### middleware

​ 全局路由中间件

```ts
export default defineNuxtRouteMiddleware((to, from) => {
    // 进行相关操作
  if (to.params.id === '1') {
    return abortNavigation()
  }
  if (to.path !== '/') {
    return navigateTo('/')
  }
})
```

​ 页面路由守卫

```vue
<script setup lang="ts">
// pages/profile.vue
definePageMeta({
    // 有多个使用数组语法，auth表示全局的中间件middleware/auth.ts
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    'auth',
  ],
});
</script>

```

### pages

​ 页面组件，自动注册路由

- 具体的文件名，`working.vue` 表示 `/working` 页面
- 动态路由：
  - `pages/users-[group]/[id].vue` ，可以匹配`/users-admins/123`
  - `pages/[xx].vue`，可以匹配到其余没有的页面，也可以处理.html情况

​ 路由重定义和别名

```ts
definePageMeta({
    path: '/index.html',
    alias: '/',
})
```

### plugins

​ 执行一些自定义行为，插件

1. 自定义应用行为 (执行生命周期的钩子，如SSR 渲染完成后执行某些操作，或者在客户端挂载前执行某些操作)
2. 添加全局方法和属性
3. 处理全局事件 (路由变化、错误处理)
4. 集成第三方库
5. 初始化和配置 (设置全局样式、初始化第三方服务等)
6. 注册全局组件和指令 (有点多余, 已经存在自动注册的组解目录)

#### 生命周期钩子

​ 可以做一些生命周期的操作:

- 服务器端渲染完成

  ```
  export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:rendered', (renderContext) => {
      // 在 SSR 完成后执行某些操作
      console.log('服务端渲染html完成');
    });
  });
  ```

- 客户端加载完成

  ```ts
  export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
      // 在客户端应用挂载后执行某些操作
      console.log('客户端页面加载完成');
    });
  });
  ```

## 网络请求

有三种方式：

- `$fetch`
- `useAsyncData`
- `useFetch`

```vue
<script setup lang="ts">
// During SSR data is fetched twice, once on the server and once on the client.
const dataTwice = await $fetch('/api/item')

// During SSR data is fetched only on the server side and transferred to the client.
const { data } = await useAsyncData('item', () => $fetch('/api/item'))

// You can also useFetch as shortcut of useAsyncData + $fetch
const { data } = await useFetch('/api/item')
</script>
```

#### 自定义封装请求

```ts
/**
 *  说明 useFetch 直接访问默认访问页面只在服务端请求一次，客户端端不会重复发起请求，后续客户端可以通过事件进行触发
 */

/**
 * http get 请求
 * @param url
 * @returns {Promise<void>}
 */
export const httpGet = async (url) => {
    return await httpRequest(url, {method: 'GET'})
}

/**
 * 统一请求方法
 * @param url
 * @param options
 * @returns {*}
 */
export const httpRequest = async (url, options) => {
    const config = useRuntimeConfig();
    // console.log("请求地址:" + config.public.baseUrl)
    return await useFetch(url, {
        baseURL: config.public.baseUrl,
        onRequest({options}) {
            // 全局请求拦截 (需要注意是服务端请求还是客户端请求,需要单独处理相关逻辑)
            options.headers = {
                "TOKEN": "123456",
                ...options.headers
            }
        },
        onResponse({response}) {
            // 全局响应拦截, 判断响应码等处理
            // console.log("返回数据" + response._data.value)
            return response._data;
        },
    })
}
```

## 环境判断

```js
if(import.meta.server){
    // 服务端
}

if(import.meta.client){
    // 客户端
}
```

## 公共/页面 配置

公共配置

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api'
    }
  }
})

// 页面中可以通过useRuntimeConfig获取
const runtimeConfig = useRuntimeConfig()
```

页面配置

```ts
export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  }
})

// 页面中获取
const appConfig = useAppConfig()
```

## SEO

### 公共SEO

```ts
export default defineNuxtConfig({
  app: {
    head: {
        // update Nuxt defaults
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'Nuxt', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  }
})
```

### 页面SEO

```vue
<script setup lang="ts">
// 管理头部标签
useHead({
  title: 'My App',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})
    
// 定义SEO   信息
useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
```

## 常用utils

### navigateTo

路由跳转

```vue
<script setup lang="ts">
// passing 'to' as a string
await navigateTo('/search')

// ... or as a route object
await navigateTo({ path: '/search' })

// ... or as a route object with query parameters
await navigateTo({
  path: '/search',
  query: {
    page: 1,
    sort: 'asc'
  }
})
</script>
```

### onBeforeRouteLeave/onBeforeRouteUpdate

vueRouter页面路由守卫

```
