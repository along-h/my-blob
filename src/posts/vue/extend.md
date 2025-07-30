---
date: 2023-06-17
category:
  - vue
---
Vue2部分用法：mixin、transition、插槽源码、插件执行机制

<!-- more -->

# Vue2扩展

## mixin

### 一、mixin方式

###### 1.1组件注入

```
<script>
  import mixins from './xxx/mixins.js'
export default {
mixins: [mixins]
}  
</script>
```

###### 1.2全局注入

```
// main.js
Vue.mixin(mixins)
```

###### 1.3命名相同

```
// data等数据对象内容，组件会覆盖mixins里的
// 生命周期，会合并为数组都会触发，create是先mixins再组件
// methods 冲突，取组件对象的键值

```

###### 1.4 优势缺点

优势：提高代码复用性；无需传送状态

缺点：不能按需引入；来源混乱；

特性：多个组件同时引入一个mixin，一个组件变化不会影响另一个组件的变化

## 动画特效

js实现动画特效

1. gasp
2. animate css
3. 切换class 预先定义好动画相关的类名
4. js操作style

transition组件原理：vue 中过渡的时候通过切换类名、监听transitionstart、transitionend实现

###### transition使用

```
<transition name="fade">
  <p v-if="show">hello</p>
</transition>

//css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

## 插槽

本质：每个具名插槽对应的其实就是一个函数，执行这个函数生成vnode。

slot渲染源码

```
/**
 * Runtime helper for rendering <slot>
 */
function renderSlot(name, fallbackRender, props, bindObject) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        if (bindObject) {
            if (true && !isObject(bindObject)) {
                warn('slot v-bind without argument expects an Object', this);
            }
            props = extend(extend({}, bindObject), props);
        }
        nodes = scopedSlotFn(props) || (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    } else {
        nodes = this.$slots[name] || (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    var target = props && props.slot;
    if (target) {
        return this.$createElement('template', {
            slot: target
        }, nodes);
    } else {
        return nodes;
    }
} // 最终返回的是vnode
```

渲染时，其实就是调用相应的this.$scopedSlots[name]函数，调用时将props传进这个函数中，所以作用域插槽能拿到相应的数据

## 插件

* 不侵入源码的情况下，对源码进行扩展，通过插件增强自身能力
* 核心内容
  * 插件基座
  * 插件注册
  * 插件卸载
  * 插件生命周期

插件可以是对象，也可以是函数

* 对象 install（执行对象里的install）
* 函数 同 install（执行当前函数）

###### 插件使用

```
// 插件使用
const myPlugin = {
  install(Vue, options) {
    console.log(options)
    // 插件内部的操作
    Vue.prototype.$myMethod = function name(params) {
      console.log('this is myMethod',params)
    }
    Vue.mixin({
      created() {
        console.log('plugin mixin created')
      }
    })
  }
}
Vue.use(myPlugin)
```

###### 插件执行机制--Vue.use原理

```
function initUse(Vue) {
    Vue.use = function(plugin) {
      // installedPlugins记录已经安装了的插件数组
      // 判断是否已经安装过，已经安装过则返回
        var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) {
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
```

###### 具体实践Vue-router

```
importViewfrom'./components/view'
importLinkfrom'./components/link'

exportlet_Vue
// 暴露出install方法
exportfunctioninstall (Vue) {
  if (install.installed&&_Vue===Vue) return
  install.installed=true

  _Vue=Vue
// 判断是否def
  constisDef=v=>v!==undefined
// 注册实例
  constregisterInstance= (vm, callVal) => {
    leti=vm.$options._parentVnode
    if (isDef(i) &&isDef(i=i.data) &&isDef(i=i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot=this
        this._router=this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot= (this.$parent&& this.$parent._routerRoot) ||this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // VueRouter对象
  Object.defineProperty(Vue.prototype, '$router', {
    get () { returnthis._routerRoot._router }
  })
// 单个路由对象
  Object.defineProperty(Vue.prototype, '$route', {
    get () { returnthis._routerRoot._route }
  })
// 注册组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  conststrats=Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter=strats.beforeRouteLeave= strats.beforeRouteUpdate=strats.created
}
```
