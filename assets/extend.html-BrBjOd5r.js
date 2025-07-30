import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as n,a as s,e as l,f as d}from"./app-CaxZhZIt.js";const a={},r=s("p",null,"Vue2部分用法：mixin、transition、插槽源码、插件执行机制",-1),t=d(`<h1 id="vue2扩展" tabindex="-1"><a class="header-anchor" href="#vue2扩展" aria-hidden="true">#</a> Vue2扩展</h1><h2 id="mixin" tabindex="-1"><a class="header-anchor" href="#mixin" aria-hidden="true">#</a> mixin</h2><h3 id="一、mixin方式" tabindex="-1"><a class="header-anchor" href="#一、mixin方式" aria-hidden="true">#</a> 一、mixin方式</h3><h6 id="_1-1组件注入" tabindex="-1"><a class="header-anchor" href="#_1-1组件注入" aria-hidden="true">#</a> 1.1组件注入</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;script&gt;
  import mixins from &#39;./xxx/mixins.js&#39;
export default {
mixins: [mixins]
}  
&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_1-2全局注入" tabindex="-1"><a class="header-anchor" href="#_1-2全局注入" aria-hidden="true">#</a> 1.2全局注入</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// main.js
Vue.mixin(mixins)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_1-3命名相同" tabindex="-1"><a class="header-anchor" href="#_1-3命名相同" aria-hidden="true">#</a> 1.3命名相同</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// data等数据对象内容，组件会覆盖mixins里的
// 生命周期，会合并为数组都会触发，create是先mixins再组件
// methods 冲突，取组件对象的键值

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_1-4-优势缺点" tabindex="-1"><a class="header-anchor" href="#_1-4-优势缺点" aria-hidden="true">#</a> 1.4 优势缺点</h6><p>优势：提高代码复用性；无需传送状态</p><p>缺点：不能按需引入；来源混乱；</p><p>特性：多个组件同时引入一个mixin，一个组件变化不会影响另一个组件的变化</p><h2 id="动画特效" tabindex="-1"><a class="header-anchor" href="#动画特效" aria-hidden="true">#</a> 动画特效</h2><p>js实现动画特效</p><ol><li>gasp</li><li>animate css</li><li>切换class 预先定义好动画相关的类名</li><li>js操作style</li></ol><p>transition组件原理：vue 中过渡的时候通过切换类名、监听transitionstart、transitionend实现</p><h6 id="transition使用" tabindex="-1"><a class="header-anchor" href="#transition使用" aria-hidden="true">#</a> transition使用</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;transition name=&quot;fade&quot;&gt;
  &lt;p v-if=&quot;show&quot;&gt;hello&lt;/p&gt;
&lt;/transition&gt;

//css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="插槽" tabindex="-1"><a class="header-anchor" href="#插槽" aria-hidden="true">#</a> 插槽</h2><p>本质：每个具名插槽对应的其实就是一个函数，执行这个函数生成vnode。</p><p>slot渲染源码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/**
 * Runtime helper for rendering &lt;slot&gt;
 */
function renderSlot(name, fallbackRender, props, bindObject) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        if (bindObject) {
            if (true &amp;&amp; !isObject(bindObject)) {
                warn(&#39;slot v-bind without argument expects an Object&#39;, this);
            }
            props = extend(extend({}, bindObject), props);
        }
        nodes = scopedSlotFn(props) || (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    } else {
        nodes = this.$slots[name] || (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    var target = props &amp;&amp; props.slot;
    if (target) {
        return this.$createElement(&#39;template&#39;, {
            slot: target
        }, nodes);
    } else {
        return nodes;
    }
} // 最终返回的是vnode
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>渲染时，其实就是调用相应的this.$scopedSlots[name]函数，调用时将props传进这个函数中，所以作用域插槽能拿到相应的数据</p><h2 id="插件" tabindex="-1"><a class="header-anchor" href="#插件" aria-hidden="true">#</a> 插件</h2><ul><li>不侵入源码的情况下，对源码进行扩展，通过插件增强自身能力</li><li>核心内容 <ul><li>插件基座</li><li>插件注册</li><li>插件卸载</li><li>插件生命周期</li></ul></li></ul><p>插件可以是对象，也可以是函数</p><ul><li>对象 install（执行对象里的install）</li><li>函数 同 install（执行当前函数）</li></ul><h6 id="插件使用" tabindex="-1"><a class="header-anchor" href="#插件使用" aria-hidden="true">#</a> 插件使用</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 插件使用
const myPlugin = {
  install(Vue, options) {
    console.log(options)
    // 插件内部的操作
    Vue.prototype.$myMethod = function name(params) {
      console.log(&#39;this is myMethod&#39;,params)
    }
    Vue.mixin({
      created() {
        console.log(&#39;plugin mixin created&#39;)
      }
    })
  }
}
Vue.use(myPlugin)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="插件执行机制-vue-use原理" tabindex="-1"><a class="header-anchor" href="#插件执行机制-vue-use原理" aria-hidden="true">#</a> 插件执行机制--Vue.use原理</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function initUse(Vue) {
    Vue.use = function(plugin) {
      // installedPlugins记录已经安装了的插件数组
      // 判断是否已经安装过，已经安装过则返回
        var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) &gt; -1) {
            return this;
        }
      // 没有安装过的逻辑
        // additional parameters
        var args = toArray(arguments, 1);
        args.unshift(this);
      // 如果是对象，并且有install函数的话，则执行install
        if (isFunction(plugin.install)) {
            plugin.install.apply(plugin, args);
        } else if (isFunction(plugin)) {
        // 是函数的话执行此函数
            plugin.apply(null, args);
        }
      // 添加安装记录
        installedPlugins.push(plugin);
        return this;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="具体实践vue-router" tabindex="-1"><a class="header-anchor" href="#具体实践vue-router" aria-hidden="true">#</a> 具体实践Vue-router</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>importViewfrom&#39;./components/view&#39;
importLinkfrom&#39;./components/link&#39;

exportlet_Vue
// 暴露出install方法
exportfunctioninstall (Vue) {
  if (install.installed&amp;&amp;_Vue===Vue) return
  install.installed=true

  _Vue=Vue
// 判断是否def
  constisDef=v=&gt;v!==undefined
// 注册实例
  constregisterInstance= (vm, callVal) =&gt; {
    leti=vm.$options._parentVnode
    if (isDef(i) &amp;&amp;isDef(i=i.data) &amp;&amp;isDef(i=i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot=this
        this._router=this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, &#39;_route&#39;, this._router.history.current)
      } else {
        this._routerRoot= (this.$parent&amp;&amp; this.$parent._routerRoot) ||this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // VueRouter对象
  Object.defineProperty(Vue.prototype, &#39;$router&#39;, {
    get () { returnthis._routerRoot._router }
  })
// 单个路由对象
  Object.defineProperty(Vue.prototype, &#39;$route&#39;, {
    get () { returnthis._routerRoot._route }
  })
// 注册组件
  Vue.component(&#39;RouterView&#39;, View)
  Vue.component(&#39;RouterLink&#39;, Link)

  conststrats=Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter=strats.beforeRouteLeave= strats.beforeRouteUpdate=strats.created
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,34);function v(u,c){return n(),i("div",null,[r,l(" more "),t])}const b=e(a,[["render",v],["__file","extend.html.vue"]]);export{b as default};
