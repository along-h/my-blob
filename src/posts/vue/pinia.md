---
date: 2024-08-06
category:
  - vue
---
Pinia基本使用及源码逻辑

<!-- more -->

# Pinia

## 一、 相比vuex优点

1. 概念只有state、getters、actions
2. pinia没有命名空间，没有module
3. 是平面数据结构，可以任意的交叉组合，没有像vuex那样的模版约束

## 二、 基本使用

### 2.1 注册

```
// main.js
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const rootStore = createPinia()
const app = createApp()
app.use(rootStore)

app.mount('#app')
```

### 2.2 定义状态

#### 2.2.1 方式一

```
// 第一种方式：使用 defineStore 函数
import { defineStore } from 'pinia'
// 接受两个参数，1. 唯一的id；2. 数据配置对象
export const useOptionStore = defineStore('optionStore', {
  state: () => {
    return {
      count: 0
    }
  }, // 状态
  getters: {
    doubleCount: (state) => state.count * 2
  }, // 计算属性
  actions: {
    increment() {
      this.count++
    }
  } // 修改器
})
```

#### 2.2.2 方式二

```
// 第二种方式：函数方式定义状态
import { computed, ref } from 'vue'
import { useOptionStore } from './useOptionStore'
export const useSetupStore = defineStore('setupStore', () => {
  const countRef = ref(0)
  const getCount = computed(() => countRef.value * 2)

  const setCount = (newCount) => {
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
```

### 2.3 使用

```
// 使用
import { useSetupStore } from './store'

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
```

## 三、 原理

### 3.1 createPinia

scope只是个作用域scope 独立空间，scope.run作用是执行接收的函数

```
export const symbolPinia = Symbol("rootPinia");

import { App, effectScope, markRaw, Plugin, ref, EffectScope, Ref } from "vue";
import { symbolPinia } from "./rootStore";

export const createPinia = () => {
  // 作用域scope 独立空间
  const scope = effectScope(true);
  // run方法发返回值就是这个fn的返回结果
  const state = scope.run(() => ref({}));
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
  } as Plugin & IRootPinia);
  return pinia;
};

export interface IRootPinia {
  [key: symbol]: symbol;
  _a: App;
  state: Ref<any>;
  _e: EffectScope;
  _s: Map<string, any>;
}
```

### 3.2 definStore

```
import {
  getCurrentInstance,
  inject,
  effectScope,
  EffectScope,
  reactive,
} from "vue";
import { IRootPinia } from "./createPinia";
import { symbolPinia } from "./rootStore";

export function defineStore(options: IPiniaStoreOptions): any;
export function defineStore(
  id: string,
  options: Pick<IPiniaStoreOptions, "actions" | "getters" | "state">
): any;
export function defineStore(id: string, setup: () => any): any;
// 实际逻辑
export function defineStore(idOrOptions: any, storeSetup?: any) {
  let id: string, options: any;
  // 判断是字符串还是对象
  if (typeof idOrOptions === "string") {
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
    if (!currentInstance) throw new Error("pinia 需要在setup函数中使用");
    // 注入 pinia
    const pinia = inject<IRootPinia>(symbolPinia)!;
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
```

### 3.3 createOptionStore

取出state、getters，getters通过computed包裹成响应式，state利用reactive处理响应式对象，actions只是个方法不需要做响应式处理，最后将state、getters、actions合并成一个对象，统一交由createSetupStore

```
const createOptionsStore = (
  id: string,
  options: Pick<IPiniaStoreOptions, "actions" | "getters" | "state">,
  pinia: IRootPinia
) => {
  const { state, getters = {}, actions } = options;
  const setup = () => {
    // 缓存 state
    if (pinia.state.value[id]) {
      console.warn(`${id} store 已经存在！`);
    }
    const localState = (pinia.state.value[id] = state ? state() : {});
    return Object.assign(
      localState,
      actions,
      Object.keys(getters).reduce(
        (computedGetter: { [key: string]: ComputedRef<any> }, name) => {
          // 计算属性可缓存
     // 通过计算属性包裹，进行监测state变化来达到响应式
          computedGetter[name] = computed(() => {
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
```

### 3.4 createSetupStore

只需要对action的this指向进行操作，不需要对state跟getters处理，因为我们在定义setupStore时以及createOptionStore中已经处理成响应式了

```
const createSetupStore = (id: string, setup: () => any, pinia: IRootPinia) => {
  // 一个store 就是一个reactive对象
  const store = reactive({});
  // store单独的scope
  let scope: EffectScope;
  // scope可以停止所有的store 每个store也可以停止自己的
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });
  // 处理action的this问题
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (typeof prop === "function") {
      // 扩展action
      setupStore[key] = wrapAction(key, prop, store);
    }
  }
  Object.assign(store, setupStore);
  // 向pinia中放入store
  pinia._s.set(id, store);
  return store;
};

const wrapAction = (key: string, action: any, store: any) => {
  return (...args: Parameters<typeof action>) => {
    // 触发action之前 可以触发一些额外的逻辑
    const res = Reflect.apply(action, store, args);
    // 返回值也可以做处理
    return res;
  };
};
```
