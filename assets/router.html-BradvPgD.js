import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as n,a as s,e as d,f as r}from"./app-CaxZhZIt.js";const a={},l=s("p",null,"vue-router相关配置",-1),t=r(`<h1 id="vue-router" tabindex="-1"><a class="header-anchor" href="#vue-router" aria-hidden="true">#</a> Vue-router</h1><h3 id="query与params区别" tabindex="-1"><a class="header-anchor" href="#query与params区别" aria-hidden="true">#</a> query与params区别</h3><p>query是查询参数，如goods?id=123，此时及时没有传id，页面也不该崩掉 params(动态路由)是写在路径中，params/123，此时不传id，页面会崩</p><h2 id="_1-动态路由参数" tabindex="-1"><a class="header-anchor" href="#_1-动态路由参数" aria-hidden="true">#</a> 1. 动态路由参数</h2><h3 id="_1-1-基本使用" tabindex="-1"><a class="header-anchor" href="#_1-1-基本使用" aria-hidden="true">#</a> 1.1 基本使用</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const User = {
  template: &#39;&lt;div&gt;User&lt;/div&gt;&#39;,
}

// 这些都会传递给 \`createRouter\`
const routes = [
  // 动态字段以冒号开始
  { path: &#39;/users/:id&#39;, component: User },
]
// /users/johnny 和 /users/jolyne 这样的 URL 都会映射到同一个路由。
// 用冒号 : 表示。当一个路由被匹配时，它的 params 的值将在每个组件中以 this.$route.params 的形式暴露出来。
// 因此，我们可以通过更新 User 的模板来呈现当前的用户 ID

const User = {
  template: &#39;&lt;div&gt;User {{ $route.params.id }}&lt;/div&gt;&#39;,
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-监听参数变化" tabindex="-1"><a class="header-anchor" href="#_1-2-监听参数变化" aria-hidden="true">#</a> 1.2 监听参数变化</h3><ol><li>watch监听</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const User = {
  template: &#39;...&#39;,
  created() {
    this.$watch(
      () =&gt; this.$route.params,
      (toParams, previousParams) =&gt; {
        // 对路由变化做出响应...
      }
    )
  },
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>2. 导航守卫
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const User = {
  template: &#39;...&#39;,
  async beforeRouteUpdate(to, from) {
    // 对路由变化做出响应...
    this.userData = await fetchUser(to.params.id)
  },
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-路由的匹配语法" tabindex="-1"><a class="header-anchor" href="#_2-路由的匹配语法" aria-hidden="true">#</a> 2. 路由的匹配语法</h2><p>定义像 <code>:userId</code> 这样的参数时，我们内部使用以下的正则 <code>([^/]+)</code> (至少有一个字符不是斜杠 <code>/</code> )来从 URL 中提取参数。这很好用，除非你需要根据参数的内容来区分两个路由。想象一下，两个路由 <code>/:orderId</code> 和 <code>/:productName</code>，两者会匹配完全相同的 URL，所以我们需要一种方法来区分它们。最简单的方法就是在路径中添加一个静态部分来区分它们：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [
  // 匹配 /o/3549
  { path: &#39;/o/:orderId&#39; },
  // 匹配 /p/books
  { path: &#39;/p/:productName&#39; },
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但在某些情况下，我们并不想添加静态的 <code>/o\`\`/p</code> 部分。由于，<code>orderId</code> 总是一个数字，而 <code>productName</code> 可以是任何东西，所以我们可以在括号中为参数指定一个自定义的正则：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [
  // /:orderId -&gt; 仅匹配数字
  { path: &#39;/:orderId(\\\\d+)&#39; },
  // /:productName -&gt; 匹配其他任何内容
  { path: &#39;/:productName&#39; },
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下，所有路由是不区分大小写的，并且能匹配带有或不带有尾部斜线的路由。例如，路由 <code>/users</code> 将匹配 <code>/users</code>、<code>/users/</code>、甚至 <code>/Users/</code>。这种行为可以通过 <code>strict</code> 和 <code>sensitive</code> 选项来修改，它们可以既可以应用在整个全局路由上，又可以应用于当前路由上：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users/posva 而非：
    // - /users/posva/ 当 strict: true
    // - /Users/posva 当 sensitive: true
    { path: &#39;/users/:id&#39;, sensitive: true },
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: &#39;/users/:id?&#39; },
  ],
  strict: true, // applies to all routes
})

const routes = [
  // 匹配 /users 和 /users/posva
  { path: &#39;/users/:userId?&#39; },
  // 匹配 /users 和 /users/42
  { path: &#39;/users/:userId(\\\\d+)?&#39; },
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以通过使用 <code>?</code> 修饰符(0 个或 1 个)将一个参数标记为可选</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [
  // 匹配 /users 和 /users/posva
  { path: &#39;/users/:userId?&#39; },
  // 匹配 /users 和 /users/42
  { path: &#39;/users/:userId(\\\\d+)?&#39; },
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-嵌套路由" tabindex="-1"><a class="header-anchor" href="#_3-嵌套路由" aria-hidden="true">#</a> 3. 嵌套路由</h2><h3 id="_3-1-基本使用" tabindex="-1"><a class="header-anchor" href="#_3-1-基本使用" aria-hidden="true">#</a> 3.1 基本使用</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const User = {
  template: \`
    &lt;div class=&quot;user&quot;&gt;
      &lt;h2&gt;User {{ $route.params.id }}&lt;/h2&gt;
      &lt;router-view&gt;&lt;/router-view&gt;
    &lt;/div&gt;
  \`,
}

const routes = [
  {
    path: &#39;/user/:id&#39;,
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 &lt;router-view&gt; 内部
        path: &#39;profile&#39;,
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 &lt;router-view&gt; 内部
        path: &#39;posts&#39;,
        component: UserPosts,
      },
    ],
  },
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-命名路由" tabindex="-1"><a class="header-anchor" href="#_3-2-命名路由" aria-hidden="true">#</a> 3.2 命名路由</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [
  {
    path: &#39;/user/:id&#39;,
    component: User,
    // 请注意，只有子路由具有名称
    children: [{ path: &#39;&#39;, name: &#39;user&#39;, component: UserHome }],
  },
]

this.$router.push({name: &#39;user&#39;})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-编程式导航" tabindex="-1"><a class="header-anchor" href="#_4-编程式导航" aria-hidden="true">#</a> 4. 编程式导航</h2><p>当你点击 <code>&lt;router-link&gt;</code> 时，内部会调用这个方法，所以点击 <code>&lt;router-link :to=&quot;...&quot;&gt;</code> 相当于调用 <code>router.push(...)</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const username = &#39;eduardo&#39;
// 我们可以手动建立 url，但我们必须自己处理编码
router.push(\`/user/\${username}\`) // -&gt; /user/eduardo
// 同样
router.push({ path: \`/user/\${username}\` }) // -&gt; /user/eduardo
// 如果可能的话，使用 \`name\` 和 \`params\` 从自动 URL 编码中获益
router.push({ name: &#39;user&#39;, params: { username } }) // -&gt; /user/eduardo
// \`params\` 不能与 \`path\` 一起使用
router.push({ path: &#39;/user&#39;, params: { username } }) // -&gt; /user

// 替换当前路由位置
router.push({ path: &#39;/home&#39;, replace: true })
// 相当于
router.replace({ path: &#39;/home&#39; })
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-重定向和别名" tabindex="-1"><a class="header-anchor" href="#_5-重定向和别名" aria-hidden="true">#</a> 5. 重定向和别名</h2><h3 id="_5-1-重定向-会发生路由跳转" tabindex="-1"><a class="header-anchor" href="#_5-1-重定向-会发生路由跳转" aria-hidden="true">#</a> 5.1 重定向(会发生路由跳转)</h3><p>重定向也是通过 <code>routes</code> 配置来完成，可以是字符串也能是对象，也能是函数</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [{ path: &#39;/home&#39;, redirect: &#39;/&#39; }]

const routes = [{ path: &#39;/home&#39;, redirect: { name: &#39;homepage&#39; } }]

const routes = [
  {
    // /search/screens -&gt; /search?q=screens
    path: &#39;/search/:searchText&#39;,
    redirect: to =&gt; {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: &#39;/search&#39;, query: { q: to.params.searchText } }
    },
  },
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定位到相对重定向</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [
  {
    // 将总是把/users/123/posts重定向到/users/123/profile。
    path: &#39;/users/:id/posts&#39;,
    redirect: to =&gt; {
      // 该函数接收目标路由作为参数
      // 相对位置不以\`/\`开头
      // 或 { path: &#39;profile&#39;}
      return &#39;profile&#39;
    },
  },
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-别名-不会发生路由跳转" tabindex="-1"><a class="header-anchor" href="#_5-2-别名-不会发生路由跳转" aria-hidden="true">#</a> 5.2 别名(不会发生路由跳转)</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [
  {
    path: &#39;/goods/:id&#39;,
    name: &#39;goodsDetail&#39;,
    component: GoodsDetail,
    alias: &#39;/goodsDetail/:id&#39;
  }
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-命名视图-多个routerview" tabindex="-1"><a class="header-anchor" href="#_6-命名视图-多个routerview" aria-hidden="true">#</a> 6. 命名视图(多个routerView)</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div&gt;
  // 默认name为default
  &lt;router-view&gt;&lt;/router-view&gt;
  &lt;router-view name=&quot;menu&quot;&gt;&lt;/router-view&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>路由配置为components(带s，为对象)</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const routes = [
  {
    path: &#39;goods/:id&#39;,
    components: {
      menu: Menu,
      default: GoodsDetail
    }
  }
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-路由模式" tabindex="-1"><a class="header-anchor" href="#_7-路由模式" aria-hidden="true">#</a> 7. 路由模式</h2><h3 id="_7-1-hash模式" tabindex="-1"><a class="header-anchor" href="#_7-1-hash模式" aria-hidden="true">#</a> 7.1 Hash模式</h3><p>它在内部传递的实际 URL 之前使用了一个哈希字符（<code>#</code>）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。不过，它在 SEO 中确实有不好的影响。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createRouter, createWebHashHistory } from &#39;vue-router&#39;

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原理：监听hashchange事件，根据得到的hash值匹配相应的组件进行展示。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 监听URL的改变
window.addEventListener(&quot;hashchange&quot;, () =&gt; {
  switch (location.hash) {
    case &quot;#/home&quot;:
      routerViewEl.innerHTML = &quot;首页&quot;;
      break;
    case &quot;#/about&quot;:
      routerViewEl.innerHTML = &quot;关于&quot;;
      break;
    default:
      routerViewEl.innerHTML = &quot;&quot;;
  }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-html5模式" tabindex="-1"><a class="header-anchor" href="#_7-2-html5模式" aria-hidden="true">#</a> 7.2 html5模式</h3><p>当使用这种历史模式时，URL 会看起来很 &quot;正常&quot;，但是由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 <code>https://example.com/user/id</code>，就会得到一个 404 错误。刷新的时候会向服务发起请求</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createRouter, createWebHistory } from &#39;vue-router&#39;

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原理：</p><p>history模式：利用h5 Api实现路由切换 包括两个方法：history.pushState和history.replaceState 一个事件：window.onpopstate</p><p>window.onpopstate能监听到浏览器的前进后退，go，forward,back，但是监听不到history.pushState和history.replaceState方法，此时需要手动调用render函数</p><h3 id="_7-3-内存模式-客户端不用-后端渲染" tabindex="-1"><a class="header-anchor" href="#_7-3-内存模式-客户端不用-后端渲染" aria-hidden="true">#</a> 7.3 内存模式(客户端不用，后端渲染)</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import {createRouter, createMemoryHistory} from &#39;vue-router&#39;

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-导航守卫" tabindex="-1"><a class="header-anchor" href="#_8-导航守卫" aria-hidden="true">#</a> 8. 导航守卫</h2><h3 id="_8-1-生命周期" tabindex="-1"><a class="header-anchor" href="#_8-1-生命周期" aria-hidden="true">#</a> 8.1 生命周期</h3><ol><li><strong>导航被触发。</strong></li><li>在失活的组件里调用 <code>beforeRouteLeave</code> 守卫。</li><li>调用全局的 <code>beforeEach</code> 守卫。</li><li>在重用的组件里调用 <code>beforeRouteUpdate</code> 守卫(2.2+)。</li><li>在路由配置里调用 <code>beforeEnter</code>。</li><li>解析异步路由组件。</li><li>在被激活的组件里调用 <code>beforeRouteEnter</code>。</li><li>调用全局的 <code>beforeResolve</code> 守卫(2.5+)。</li><li>导航被确认。</li><li>用全局的 <code>afterEach</code> 钩子。</li><li>触发 DOM 更新。</li><li>调用 <code>beforeRouteEnter</code> 守卫中传给 <code>next</code> 的回调函数，创建好的组件实例会作为回调函数的参数传入。</li></ol><h3 id="_8-2-全局前置守卫" tabindex="-1"><a class="header-anchor" href="#_8-2-全局前置守卫" aria-hidden="true">#</a> 8.2 全局前置守卫</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const router = createRouter({ ... })

router.beforeEach((to, from, next) =&gt; {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-全局解析守卫" tabindex="-1"><a class="header-anchor" href="#_8-3-全局解析守卫" aria-hidden="true">#</a> 8.3 全局解析守卫</h3><p>解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>router.beforeResolve(async (to, from ,next) =&gt; {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-全局后置钩子" tabindex="-1"><a class="header-anchor" href="#_8-4-全局后置钩子" aria-hidden="true">#</a> 8.4 全局后置钩子</h3><p>跳转后，钩子不会接受 <code>next</code> 函数也不会改变导航本身</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>router.afterEach((to, from) =&gt; {
  sendToAnalytics(to.fullPath)
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-5-路由独享守卫" tabindex="-1"><a class="header-anchor" href="#_8-5-路由独享守卫" aria-hidden="true">#</a> 8.5 路由独享守卫</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const router = createRouter({
  routes: [
    {
      path: &#39;/users&#39;,
      beforeEnter: (to, from, next) =&gt; {
        // ...
      }
    }
  ]
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-6组件内钩子函数" tabindex="-1"><a class="header-anchor" href="#_8-6组件内钩子函数" aria-hidden="true">#</a> 8.6组件内钩子函数</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>export default {
  // 刚进去时，组件还没渲染
  beforeRouterEnter(to, from ,next) {
    // 可以传入回调函数,访问组件实例
    next(vm =&gt; {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-7-数据获取" tabindex="-1"><a class="header-anchor" href="#_8-7-数据获取" aria-hidden="true">#</a> 8.7 数据获取</h3><ol><li><strong>导航完成后获取</strong><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>export default {
  created() {
    this.$watch(this.$route.params, () =&gt; {
      // 获取数据
    })
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><strong>导航完成前获取</strong><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>export default {
  beforeRouterEnter() {
    // 获取数据
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="_8-8-路由懒加载" tabindex="-1"><a class="header-anchor" href="#_8-8-路由懒加载" aria-hidden="true">#</a> 8.8 路由懒加载</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const router = {
  routes: [
    {
      path: &#39;/users&#39;,
      component: () =&gt; import(&#39;../views/Users.vue&#39;)
    }
  ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-9-导航故障" tabindex="-1"><a class="header-anchor" href="#_8-9-导航故障" aria-hidden="true">#</a> 8.9 导航故障</h3><p>当使用 <code>router-link</code> 组件时，Vue Router 会自动调用 <code>router.push</code> 来触发一次导航。虽然大多数链接的预期行为是将用户导航到一个新页面，但也有少数情况下用户将留在同一页面上：</p><ul><li><strong>用户已经位于他们正在尝试导航到的页面</strong></li><li>一个导航守卫通过调用 <code>return false</code> 中断了这次导航</li><li>当前的导航守卫还没有完成时，一个新的导航守卫会出现了</li><li>一个导航守卫通过返回一个新的位置，重定向到其他地方 (例如，<code>return &#39;/login&#39;</code>)</li><li>一个导航守卫抛出了一个 <code>Error</code></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const navigationResult = await router.push(&#39;/my-profile&#39;)

if (navigationResult) {
  // 导航被阻止
} else {
  // 导航成功 (包括重新导航的情况)
  this.isMenuOpen = false
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>Navigation Failure</em> 是带有一些额外属性的 <code>Error</code> 实例，这些属性为我们提供了足够的信息，让我们知道哪些导航被阻止了以及为什么被阻止了。要检查导航结果的性质，请使用 <code>isNavigationFailure</code> 函数：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { NavigationFailureType, isNavigationFailure } from &#39;vue-router&#39;

// 试图离开未保存的编辑文本界面
const failure = await router.push(&#39;/articles/2&#39;)

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 给用户显示一个小通知
  showToast(&#39;You have unsaved changes, discard and leave anyway?&#39;)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>NavigationFailureType总共有三种不同的类型：</p><ul><li><code>aborted</code>：在导航守卫中返回 <code>false</code> 中断了本次导航。</li><li><code>cancelled</code>： 在当前导航还没有完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 <code>router.push</code>。</li><li><code>duplicated</code>：导航被阻止，因为我们已经在目标位置了。</li></ul><h2 id="_9-手写vuerouter-vue-router3" tabindex="-1"><a class="header-anchor" href="#_9-手写vuerouter-vue-router3" aria-hidden="true">#</a> 9. 手写vueRouter(vue-router3)</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//myVueRouter.js
let Vue = null;
class HistoryRoute {
    constructor() {
        this.current = null;
    }
}
class VueRouter {
    constructor(options) {
        this.mode = options.mode || &#39;hash&#39;;
        this.routes = options.routes || []; //你传递的这个路由是一个数组表
        this.routesMap = this.createMap(this.routes);
        this.history = new HistoryRoute();
        this.init();
    }
    init() {
        if (this.mode === &#39;hash&#39;) {
            // 先判断用户打开时有没有hash值，没有的话跳转到#/
            location.hash ? &#39;&#39; : (location.hash = &#39;/&#39;);
            window.addEventListener(&#39;load&#39;, () =&gt; {
                this.history.current = location.hash.slice(1);
            });
            window.addEventListener(&#39;hashchange&#39;, () =&gt; {
                this.history.current = location.hash.slice(1);
            });
        } else {
            location.pathname ? &#39;&#39; : (location.pathname = &#39;/&#39;);
            window.addEventListener(&#39;load&#39;, () =&gt; {
                this.history.current = location.pathname;
            });
            window.addEventListener(&#39;popstate&#39;, () =&gt; {
                this.history.current = location.pathname;
            });
        }
    }

    createMap(routes) {
        return routes.reduce((pre, current) =&gt; {
            pre[current.path] = current.component;
            return pre;
        }, {});
    }
}
VueRouter.install = function (v) {
    Vue = v;
    Vue.mixin({
        beforeCreate() {
            if (this.$options &amp;&amp; this.$options.router) {
                // 如果是根组件
                this._root = this; //把当前实例挂载到_root上
                this._router = this.$options.router;
                Vue.util.defineReactive(this, &#39;xxx&#39;, this._router.history);
            } else {
                //如果是子组件
                this._root = this.$parent &amp;&amp; this.$parent._root;
            }
            Object.defineProperty(this, &#39;$router&#39;, {
                get() {
                    return this._root._router;
                },
            });
            Object.defineProperty(this, &#39;$route&#39;, {
                get() {
                    return this._root._router.history.current;
                },
            });
        },
    });
    Vue.component(&#39;router-link&#39;, {
        props: {
            to: String,
        },
        render(h) {
            let mode = this._self._root._router.mode;
            let to = mode === &#39;hash&#39; ? &#39;#&#39; + this.to : this.to;
            return h(&#39;a&#39;, { attrs: { href: to } }, this.$slots.default);
        },
    });
    Vue.component(&#39;router-view&#39;, {
        render(h) {
            let current = this._self._root._router.history.current;
            let routeMap = this._self._root._router.routesMap;
            return h(routeMap[current]);
        },
    });
};

export default VueRouter;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-ssr-服务端渲染" tabindex="-1"><a class="header-anchor" href="#_10-ssr-服务端渲染" aria-hidden="true">#</a> 10. SSR(服务端渲染)</h2><h3 id="_10-1-优势" tabindex="-1"><a class="header-anchor" href="#_10-1-优势" aria-hidden="true">#</a> 10.1 优势：</h3><ol><li>方便SEO</li><li>白屏时间更短 相对于客户端渲染，服务端渲染在浏览器请求URL之后已经得到了一个带有数据的HTML文本，浏览器只需要解析HTML，直接构建DOM树就可以。而客户端渲染，需要先得到一个空的HTML页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。</li></ol><h3 id="_10-2-缺点" tabindex="-1"><a class="header-anchor" href="#_10-2-缺点" aria-hidden="true">#</a> 10.2 缺点：</h3><ol><li>代码复杂度增加。为了实现服务端渲染，应用代码中需要兼容服务端和客户端两种运行情况，而一部分依赖的外部扩展库却只能在客户端运行，需要对其进行特殊处理，才能在服务器渲染应用程序中运行。</li><li>需要更多的服务器负载均衡。由于服务器增加了渲染HTML的需求，使得原本只需要输出静态资源文件的nodejs服务，新增了数据获取的IO和渲染HTML的CPU占用，如果流量突然暴增，有可能导致服务器down机，因此需要使用响应的缓存策略和准备相应的服务器负载。</li><li>涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。</li></ol><h3 id="_10-3-基础ssr应用" tabindex="-1"><a class="header-anchor" href="#_10-3-基础ssr应用" aria-hidden="true">#</a> 10.3 基础SSR应用</h3><p><strong>核心使用</strong> <code>createSSRApp</code>和 <code>express</code>实现</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createSSRApp } from &#39;vue&#39;;
import express from &#39;express&#39;;
import { renderToString } from &#39;vue/server-renderer&#39;;

export function createApp() {
  return createSSRApp({
    data: () =&gt; ({ count: 1 }),
    template: \`&lt;div @click=&quot;count++&quot;&gt;{{ count }}&lt;/div&gt;\`,
  });
}

const server = express();

server.get(&#39;/&#39;, (req, res) =&gt; {
  const app = createApp();

  renderToString(app).then(html =&gt; {
    res.send(\`
    &lt;!DOCTYPE html&gt;
    &lt;html&gt;
      &lt;head&gt;
        &lt;title&gt;Vue SSR Example&lt;/title&gt;
        &lt;script type=&quot;importmap&quot;&gt;
          {
            &quot;imports&quot;: {
              &quot;vue&quot;: &quot;https://unpkg.com/vue@3/dist/vue.esm-browser.js&quot;
            }
          }
        &lt;/script&gt;
        &lt;script type=&quot;module&quot; src=&quot;/client.js&quot;&gt;&lt;/script&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &lt;div id=&quot;app&quot;&gt;\${html}&lt;/div&gt;
      &lt;/body&gt;
    &lt;/html&gt;
    \`);
  });
});

server.use(express.static(&#39;.&#39;));

server.listen(3000, () =&gt; {
  console.log(&#39;ready&#39;);
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-vue常见方案" tabindex="-1"><a class="header-anchor" href="#_10-3-vue常见方案" aria-hidden="true">#</a> 10.3 Vue常见方案</h3><ol><li>Nuxt</li><li>Quasar</li><li>Vite SSR</li></ol><p>同构：服务端执行一次、客户端执行一次</p>`,94);function v(u,c){return n(),i("div",null,[l,d(" more "),t])}const b=e(a,[["render",v],["__file","router.html.vue"]]);export{b as default};
