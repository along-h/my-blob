import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as n,a as s,e as t,f as d}from"./app-CaxZhZIt.js";const a={},r=s("p",null,"Pinia基本使用及源码逻辑",-1),l=d(`<h1 id="pinia" tabindex="-1"><a class="header-anchor" href="#pinia" aria-hidden="true">#</a> Pinia</h1><h2 id="一、-相比vuex优点" tabindex="-1"><a class="header-anchor" href="#一、-相比vuex优点" aria-hidden="true">#</a> 一、 相比vuex优点</h2><ol><li>概念只有state、getters、actions</li><li>pinia没有命名空间，没有module</li><li>是平面数据结构，可以任意的交叉组合，没有像vuex那样的模版约束</li></ol><h2 id="二、-基本使用" tabindex="-1"><a class="header-anchor" href="#二、-基本使用" aria-hidden="true">#</a> 二、 基本使用</h2><h3 id="_2-1-注册" tabindex="-1"><a class="header-anchor" href="#_2-1-注册" aria-hidden="true">#</a> 2.1 注册</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// main.js
import { createPinia } from &#39;pinia&#39;
import { createApp } from &#39;vue&#39;

const rootStore = createPinia()
const app = createApp()
app.use(rootStore)

app.mount(&#39;#app&#39;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-定义状态" tabindex="-1"><a class="header-anchor" href="#_2-2-定义状态" aria-hidden="true">#</a> 2.2 定义状态</h3><h4 id="_2-2-1-方式一" tabindex="-1"><a class="header-anchor" href="#_2-2-1-方式一" aria-hidden="true">#</a> 2.2.1 方式一</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 第一种方式：使用 defineStore 函数
import { defineStore } from &#39;pinia&#39;
// 接受两个参数，1. 唯一的id；2. 数据配置对象
export const useOptionStore = defineStore(&#39;optionStore&#39;, {
  state: () =&gt; {
    return {
      count: 0
    }
  }, // 状态
  getters: {
    doubleCount: (state) =&gt; state.count * 2
  }, // 计算属性
  actions: {
    increment() {
      this.count++
    }
  } // 修改器
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-2-方式二" tabindex="-1"><a class="header-anchor" href="#_2-2-2-方式二" aria-hidden="true">#</a> 2.2.2 方式二</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 第二种方式：函数方式定义状态
import { computed, ref } from &#39;vue&#39;
import { useOptionStore } from &#39;./useOptionStore&#39;
export const useSetupStore = defineStore(&#39;setupStore&#39;, () =&gt; {
  const countRef = ref(0)
  const getCount = computed(() =&gt; countRef.value * 2)

  const setCount = (newCount) =&gt; {
    countRef.value = newCount
  }

  // 也可以使用其他store
  const otherStore = useOptionStore()
  console.log(otherStore.count)
  return {
    count: countRef,
    getCount,
    setCount
  }
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-使用" tabindex="-1"><a class="header-anchor" href="#_2-3-使用" aria-hidden="true">#</a> 2.3 使用</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 使用
import { useSetupStore } from &#39;./store&#39;

// 第一种方式
const optionStore = useOptionStore()
optionStore.count++
optionStore.increment()
optionStore.$patch({ count: count + 1 })
optionStore.$reset() //重置
console.log(optionStore.doubleCount)

// 第二种方式
const setupStore = useSetupStore() // 也可以直接解构
setupStore.count = 10
setupStore.setCount(10)
console.log(setupStore.getCount)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、-原理" tabindex="-1"><a class="header-anchor" href="#三、-原理" aria-hidden="true">#</a> 三、 原理</h2><h3 id="_3-1-createpinia" tabindex="-1"><a class="header-anchor" href="#_3-1-createpinia" aria-hidden="true">#</a> 3.1 createPinia</h3><p>scope只是个作用域scope 独立空间，scope.run作用是执行接收的函数</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>export const symbolPinia = Symbol(&quot;rootPinia&quot;);

import { App, effectScope, markRaw, Plugin, ref, EffectScope, Ref } from &quot;vue&quot;;
import { symbolPinia } from &quot;./rootStore&quot;;

export const createPinia = () =&gt; {
  // 作用域scope 独立空间
  const scope = effectScope(true);
  // run方法发返回值就是这个fn的返回结果
  const state = scope.run(() =&gt; ref({}));
  // 将一个对象标记为不可被转为代理。返回该对象本身。
  const pinia = markRaw({
    install(app: App) {
      // pinia希望能被共享出去
      // 将pinia实例暴露到app上，所有的组件都可以通过inject注入进去
      app.provide(symbolPinia, pinia);
      // 可以在模板访问 直接通过 $pinia访问根pinia
      app.config.globalProperties.$pinia = pinia;
      // pinia也记录一下app 方便后续使用
      pinia._a = app;
    },
    // 所有的state
    state,
    _e: scope, // 管理整个应用的scope
    // 所有的store
    _s: new Map(),
  } as Plugin &amp; IRootPinia);
  return pinia;
};

export interface IRootPinia {
  [key: symbol]: symbol;
  _a: App;
  state: Ref&lt;any&gt;;
  _e: EffectScope;
  _s: Map&lt;string, any&gt;;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-definstore" tabindex="-1"><a class="header-anchor" href="#_3-2-definstore" aria-hidden="true">#</a> 3.2 definStore</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import {
  getCurrentInstance,
  inject,
  effectScope,
  EffectScope,
  reactive,
} from &quot;vue&quot;;
import { IRootPinia } from &quot;./createPinia&quot;;
import { symbolPinia } from &quot;./rootStore&quot;;

export function defineStore(options: IPiniaStoreOptions): any;
export function defineStore(
  id: string,
  options: Pick&lt;IPiniaStoreOptions, &quot;actions&quot; | &quot;getters&quot; | &quot;state&quot;&gt;
): any;
export function defineStore(id: string, setup: () =&gt; any): any;
// 实际逻辑
export function defineStore(idOrOptions: any, storeSetup?: any) {
  let id: string, options: any;
  // 判断是字符串还是对象
  if (typeof idOrOptions === &quot;string&quot;) {
    id = idOrOptions;
    options = storeSetup;
  } else {
    // 这里就是一个参数的形式 id参数定义在对象内
    options = idOrOptions;
    id = idOrOptions.id;
  }
  // 注册一个store
  function useStore() {
    // 必须在setup中使用
    const currentInstance = getCurrentInstance();
    if (!currentInstance) throw new Error(&quot;pinia 需要在setup函数中使用&quot;);
    // 注入 pinia
    const pinia = inject&lt;IRootPinia&gt;(symbolPinia)!;
    // 还没注册
    if (!pinia._s.has(id)) {
      // 判断是setupStore还是optionStore
      if (isSetupStore) {
      // 创建setupStore
      createSetupStore(id, storeSetup, pinia);
    } else {
      // counter:state:{count:0}
      // 创建OptionsStore，存储state、getters、actions
      createOptionsStore(id, options, pinia);
    }
    }
    // 获取store
    const store = pinia._s.get(id);
    return store;
  }
  return useStore;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-createoptionstore" tabindex="-1"><a class="header-anchor" href="#_3-3-createoptionstore" aria-hidden="true">#</a> 3.3 createOptionStore</h3><p>取出state、getters，getters通过computed包裹成响应式，state利用reactive处理响应式对象，actions只是个方法不需要做响应式处理，最后将state、getters、actions合并成一个对象，统一交由createSetupStore</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const createOptionsStore = (
  id: string,
  options: Pick&lt;IPiniaStoreOptions, &quot;actions&quot; | &quot;getters&quot; | &quot;state&quot;&gt;,
  pinia: IRootPinia
) =&gt; {
  const { state, getters = {}, actions } = options;
  const setup = () =&gt; {
    // 缓存 state
    if (pinia.state.value[id]) {
      console.warn(\`\${id} store 已经存在！\`);
    }
    const localState = (pinia.state.value[id] = state ? state() : {});
    return Object.assign(
      localState,
      actions,
      Object.keys(getters).reduce(
        (computedGetter: { [key: string]: ComputedRef&lt;any&gt; }, name) =&gt; {
          // 计算属性可缓存
     // 通过计算属性包裹，进行监测state变化来达到响应式
          computedGetter[name] = computed(() =&gt; {
            // 我们需要获取当前的store是谁
            return Reflect.apply(getters[name], store, [store]);
          });
          return computedGetter;
        },
        {}
      )
    );
  };
  const store = createSetupStore(id, setup, pinia);
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-createsetupstore" tabindex="-1"><a class="header-anchor" href="#_3-4-createsetupstore" aria-hidden="true">#</a> 3.4 createSetupStore</h3><p>只需要对action的this指向进行操作，不需要对state跟getters处理，因为我们在定义setupStore时以及createOptionStore中已经处理成响应式了</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const createSetupStore = (id: string, setup: () =&gt; any, pinia: IRootPinia) =&gt; {
  // 一个store 就是一个reactive对象
  const store = reactive({});
  // store单独的scope
  let scope: EffectScope;
  // scope可以停止所有的store 每个store也可以停止自己的
  const setupStore = pinia._e.run(() =&gt; {
    scope = effectScope();
    return scope.run(() =&gt; setup());
  });
  // 处理action的this问题
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (typeof prop === &quot;function&quot;) {
      // 扩展action
      setupStore[key] = wrapAction(key, prop, store);
    }
  }
  Object.assign(store, setupStore);
  // 向pinia中放入store
  pinia._s.set(id, store);
  return store;
};

const wrapAction = (key: string, action: any, store: any) =&gt; {
  return (...args: Parameters&lt;typeof action&gt;) =&gt; {
    // 触发action之前 可以触发一些额外的逻辑
    const res = Reflect.apply(action, store, args);
    // 返回值也可以做处理
    return res;
  };
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25);function v(c,o){return n(),i("div",null,[r,t(" more "),l])}const b=e(a,[["render",v],["__file","pinia.html.vue"]]);export{b as default};
