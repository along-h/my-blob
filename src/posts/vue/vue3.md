---
date: 2024-07-17
category:
  - vue
---
Vue3相关知识点以及对比Vue2优势

<!-- more -->

# Vue3

## 一、Vue3的性能提升方便

### 1. 编译阶段优化

回顾Vue2，我们知道每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把用到的数据property记录为依赖，当依赖发生改变，触发setter，则会通知watcher，从而使关联的组件重新渲染。

##### 1.1 diff算法优化

vue2是采用的双端交叉指针，队头与队头、队尾与队尾、队头与队尾、队尾与队头，对比4次，4次寻找到key相同，就会进行复用，进行移动位置，4次都没匹配到会采用暴力比对的方式，在新的vdom的队头开始依次再去寻找老的vdom里有没有一样的，有的话进行相应的移动，最后新的有多的话直接插入，老的有多的话进行删除。

vue3是双端快速diff，只对比两种情况，队头与队头、队尾与队尾，如果能匹配上与vue2一致，没有匹配上的话会进行最长递增子序列的计算（为了寻找最小的dom移动），在新的vdom中寻找依次递增的元素有哪些，那这些元素的顺序就是固定的，去寻找不在这些列表里的元素和老的vdom进行对比再进行相应的移动、创建、删除。另外相比vue2增加了静态标记，其作用是为了会发生变化的地方添加一个flag标记，下次发生变化的时候直接找该地方进行比较。（可看b站哲玄前端）

##### 1.2 静态提升

Vue3中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用。免去了重复的创建操作，优化内存。

##### 1.3  事件监听缓存

默认情况下绑定事件行为会被视为动态绑定（没开启事件监听器缓存），所以每次都会去追踪它的变化。开启事件侦听器缓存后，没有了静态标记。也就是说下次diff算法的时候可以直接使用

##### 1.4 SSR优化

当静态内容大到一定量级时候，会用createStaticVNode方法在客户端去生成一个static node，这些静态node，会被直接innerHtml，就不需要创建对象，然后根据对象渲染

### 2.源码体积

相比Vue2，Vue3整体体积变小了，除了移出一些不常用的API。任何一个函数，如ref、reavtived、computed等，仅仅在用到的时候才打包，没用到的模块都被摇掉，打包的整体体积变小。（利用了Tree shanking）

### 3.响应式系统

vue2中采用 defineProperty来劫持整个对象，然后进行深度遍历所有属性，给每个属性添加getter和setter，实现响应式。

vue3采用proxy重写了响应式系统，因为proxy可以对整个对象进行监听，所以不需要深度遍历。

## 二、Vue3为什么要用Proxy代替defineProperty

**1、**`vue2`中采用 `defineProperty`来劫持整个对象，然后进行深度遍历所有属性，给每个属性添加getter和setter，实现响应式。但是存在以下的问题：

1. **检测不到对象属性的添加和删除**
2. **数组API方法无法监听到**
3. **需要对每个属性进行遍历监听，如果嵌套对象还需要深度监听，会造成性能问题**

**2、proxy：监听是针对一个对象的，那么对这个对象的所有操作会进入监听操作。**

1. **Object.defineProperty只能遍历对象属性进行劫持**
2. **Proxy直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的**
3. **Proxy可以直接监听数组的变化（push、shift、splice）**
4. **Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等，这是Object.defineProperty不具备的**

## 三、Vue3.0性能提升主要是通过哪几方面体现的

##### 1.1 编译阶段优化

**回顾 `Vue2`，我们知道每个组件实例都对应一个 `watcher 实例`，它会在组件渲染的过程中把用到的数据 `property`记录为依赖，当依赖发生改变，触发 `setter`，则会通知 `watcher`，从而使关联的组件重新渲染。**
因此，`Vue3`在编译阶段，做了进一步优化：

1. **diff算法优化：**`vue3`在 `diff`算法中相比 `vue2`增加了 `静态标记`，其作用是为了会发生变化的地方添加一个 `flag标记`，下次发生变化的时候 `直接`找该地方进行比较。
2. **静态提升：Vue3中对** `不参与更新`的元素，会做静态提升，`只会被创建一次`，在渲染时直接复用。免去了重复的创建操作，优化内存
3. **事件监听缓存：默认情况下绑定事件行为会被视为动态绑定（**`没开启事件监听器缓存`），所以 `每次`都会去追踪它的变化。`开启事件侦听器缓存`后，没有了静态标记。也就是说下次 `diff算法`的时候 `直接使用`。
4. **SSR优化：当静态内容大到一定量级时候，会用** `createStaticVNode`方法在客户端去生成一个 `static node`，这些 `静态node`，会被直接 `innerHtml`，就不需要创建对象，然后根据对象渲染。

##### 1.2 源码体积

相比 `Vue2`，`Vue3`整体体积 `变小`了，除了移出一些 `不常用的API`，最重要的是引入 `Tree shanking`。任何一个函数，如 `ref、reavtived、computed`等，仅仅在 `用到`的时候才 `打包`，`没用到`的模块都 `被摇掉`，打包的整体体积 `变小`。

##### 1.3 响应式系统

`vue2`中采用 `defineProperty`来劫持整个对象，然后进行深度遍历所有属性，给 `每个属性`添加 `getter和setter`，实现响应式。`vue3`采用 `proxy`重写了响应式系统，因为 `proxy`可以对 `整个对象进行监听`，所以不需要深度遍历。

* **可以监听动态属性的添加**
* **可以监听到数组的索引和数组length属性**
* **可以监听删除属性**

## 四、Vue2双向绑定与MVVM

##### 4.1 双向绑定

**Vue实现数据双向绑定的原理：Object.defineProperty（）**
**vue实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty（）来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。**
vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 {{}}），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。

#### 4.2 MVVM

MVVM分为view层（DOM）model层（数据）ViewModel（Vue实例），view与model层通过viewModel进行连接，viewmodel通过双向绑定监听两边的变化去实现view与model的同步，viewmodel中就是vue2的双向绑定原理，数据劫持结合发布者-订阅者模式。

vue则是采用发布者-订阅者模式，通过Object.defineProperty()来劫持各个属性的getter和setter，在数据变动时发布消息给订阅者，触发相应的监听回调。

## 五、获取data中某一状态初始值

**可以通过this.$options.data().keyname来获取初始**

## 六、动态给vue的data添加一个新的属性时为什么不刷新

一开始data里面的obj的属性会被设成了响应式数据，而后面新增的属性，并没有通过Object.defineProperty设置成响应式数据。

解决方法：

1. **vue.set()**
2. **Object.assign()，需创建一个空对象进行合并**
3. **this.$forceUpdated**

**注意：Vue3中利用proxy实现数据响应，动态添加仍可以刷新**

## 七、reactive源码

```
function reactive(obj) {
    if (typeof obj !== 'object' && obj != null) {
        return obj
    }
    // Proxy相当于在对象外层加拦截
    const observed = new Proxy(obj, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver)
            console.log(`获取${key}:${res}`)
            return res
        },
        set(target, key, value, receiver) {
            const res = Reflect.set(target, key, value, receiver)
            console.log(`设置${key}:${value}`)
            return res
        },
        deleteProperty(target, key) {
            const res = Reflect.deleteProperty(target, key)
            console.log(`删除${key}:${res}`)
            return res
        }
    })
    return observed
}
```

## 八、vue3.0编译做了哪一些优化

1. **静态树提升： Vue 3.0 通过重写编译器，实现对静态节点（即不改变的节点）进行编译优化，使用HoistStatic功能将静态节点移动到 render 函数外部进行缓存，从而服务端渲染和提高前端渲染的性能。**
2. **Patch Flag：在Vue 3.0中，编译的生成vnode会根据节点patch的标记，只对需要重新渲染的数据进行响应式更新，不需要更新的数据不会重新渲染，从而大大提高了渲染性能。**
3. **静态属性提升：Vue3中对** `不参与更新`的元素，会做静态提升，`只会被创建一次`，在渲染时直接复用。免去了重复的创建操作，优化内存。 没做静态提升之前，未参与更新的元素也在 `render函数`内部，会重复 `创建阶段`。**
   **做了静态提升后，未参与更新的元素，被 `放置在render 函数外`，每次渲染的时候只要 `取出`即可。同时该元素会被打上 `静态标记值为-1`，特殊标志是 `负整数`表示永远不会用于 `Diff`。
4. `事件监听缓存`：默认情况下绑定事件行为会被视为动态绑定（`没开启事件监听器缓存`），所以 `每次`都会去追踪它的变化。`开启事件侦听器缓存`后，没有了静态标记。也就是说下次 `diff算法`的时候 `直接使用`。

### 九、mixin

##### 9.1 冲突处理特点

1. **当组件和mixin同时定义生命周期选项,两个都会触发,而且mixin会先触发**
2. **如果组件和mixin同时定义相同方法,会使用组件方法,会覆盖mixin**
3. **如果组件和mixin同时定义相同计算属性,会使用组件方法,会覆盖mixin**

##### 9.2 优缺点

**优点**

* **提高代码复用性和可维护性。**
* **使组件更易于测试和理解。**
* **允许您在多个组件之间共享和重用代码**

**缺点**

* **Mixins 可能会引入命名冲突和重复代码。**
* **Mixins 可能会导致组件之间的依赖关系不清晰。**

### 十、vue2跟vue3响应式原理

**Observer-----监听函数**

**defineProperty ---- 定义属性，增加getter、setter**

##### 10.1 vue2

**数组**

vue2数组的响应式是通过重写数组原型上的 7 个方法来实现，其实Object.defineProperty可以监听到数组的变化，但是这么做会导致性能很差，性能和用户体验收益不成正比，因为数组的长度往往会很长。

##### vue 无法监听数组变化的场景

1. **通过数组索引改变数组元素的值；**
2. **改变数组的长度**

**对象**

vue2中对象的响应式是只有第一层的，代码实现看observer

##### 10.3 Compile

1、判断el是不是元素节点，如果不是，就要取到el这个标签，然后传入vm实例

2、递归拿到所有子节点，便于下一步去解析它们。【注意：这一步会频繁触发页面的回流和重绘，所以我们需要把节点先存入文档碎片对象中，就相当于把他们放到了内存中，减少了页面的回流和重绘。】

3、在文档碎片对象中编译好模板；

4、最后再把文档碎片对象追加到根元素上。

##### 10.4 Updater

作用：更新试图

```
// 更新的函数
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    modelUpdater(node, value){
      node.value = value;
    }
  },
```

##### 10.5 Observer，数据劫持

1、递归，将data中所有的属性、对象、子对象……都遍历出来

2、对每个key，使用Object.defineProperty劫持数据（Object.defineProperty()的作用就是直接在一个对象上定义一个新属性，或者修改一个已经存在的属性）

3、Object.defineProperty下有get方法和set方法，也就是官方原理图上的getter和stter啦

4、在劫持数据之前，创建依赖器Dep实例dep

5、对于gettter，订阅数据变化时，往dep中添加观察者；

6、对于setter，当数据变化时，将newVal赋值为新值，并用notify通知dep变化。（此处正好对应官方原理图）

4、5、6这最后三点可以说是MVVM实现中最关键、最巧妙的3步，正是这画龙点睛的三笔，把整个系统桥梁成功架起来，注意它们各自放置在代码中位置。

```
// 用于监听数据类型，不同类型进行不同处理
function Observer(target){
// 判断，如果是基本类型，直接返回
// Object.definePrototype只能针对 对象做处理
if(typeof target != 'object' || typeof target != 'array'){
return target
}
// 处理对象
if(target instanceof Object){
for(let key in target){
defineReactive(target,key,target[value])
}
}
// 处理数组 
else if(target instanceof Array){
// 数组需要使用另外的思路处理，因为Object.definePrototype只对  对象有效,重写数组的几个方法
}
}
// 通过Object.definePrototype 对对象类型进行响应式处理
function defineReactive(target,key,value){
// 需要对当前对象的每个key对应的value进行类型判断，如果是对象，则需要递归
Observer(target[key])
  const dep = new Dep();
Object.definePrototype(target,key,{
get(){
      // 收集依赖，及观察者，通知watcher观察者改变数据
       if (Dep.target) {
         dep.addSub(Dep.target);
       }
console.log(key + 'getter被调用...')
return value
},
set(newV){
console.log(key + 'setter方法被调用...')
if(newV !== value){
value = newV
// 假设我定义的有render()方法...
// 通知视图更新.........
render()
}
}
})
}
```

##### 10.6 Dep数据依赖器

**主要作用：**

1. 收集要更新的观察者
2. 通知每个观察者去更新

```
// 数据依赖器
class Dep {
    constructor() {
        this.subs = [];
    }
    // 收集观察者
    addSub(watcher) {
        this.subs.push(watcher);
    }
    // 通知观察者去更新
    notify() {
        console.log("通知了观察者", this.subs);
        this.subs.forEach(w =>w.update())
    }
}
```

##### 10.7 Watcher观察者

**注意** `Dep.target = this;`这一步，是为了把观察者挂载到Dep实例上，关联起来。所以当观察者Watcher获取旧值后，应该解除关联，否则会重复地添加观察者。最后，使用callback回调函数传递要处理的新值给Updater即可。

```
class Watcher {
  constructor(vm, expr, callback) {
    // 把新值通过cb传出去
    this.vm = vm;
    this.expr = expr;
    this.callback = callback;
    // 先把旧值保存起来
    this.oldVal = this.getOldVal();
  }
  getOldVal() {
    // 把观察者挂载到Dep实例上，关联起来
    Dep.target = this;
    const oldVal = compileUtil.getVal(this.expr, this.vm);
    // 获取旧值后，取消关联，就不会重复添加
    Dep.target = null;
    return oldVal;
  }
  update() {
    // 更新，要取旧值和新值
    const newVal = compileUtil.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
        this.callback(newVal);
    }
  }
}
```

### 十一、forceUpdate原理

```
Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
        vm._watcher.update()
    }
}
```

### 十二、shallowReactive、shallowRef、shallowReadonly

**只对第一层进行代理**

```
function shallowReactive(obj){
    return new Proxy(obj, {
        get(obj, key){
            return obj[key]
        },
        set(obj, key, val){
            obj[key] = val
            console.log("更新UI界面")
            return true
        }
    })
}
function shallowRef(val){
    // 实现代码只需要shallowReactive拿过来那代理一次就可
    return shallowReactive({value: val})
}
// shallowReadonly只需要set函数中不要设置值
function shallowReadonly(obj){
    return new Proxy(obj, {
        get(obj, key){
            return obj[key]
        },
        set(obj, key, val){
            console.warn(`${key} 只读，不能赋值`)
            return true
        }
    })
}
```

### 十三、reactive、ref、readonly

**需要把所有的对象进行代理**

```
// 产生递归监听
function reactive(obj){
    if(typeof obj === "object"){
        if(obj instanceof Array){
            // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
            // 如果又是一个对象需要包装成一个proxy
            obj.forEach((item, index) => {
                if(typeof item === "object"){
                    obj[index] = reactive(item)
                }
            })
        }else {
            // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
            for (const key in obj) {
                let item = obj[key]
                if(typeof item === "object"){
                    obj[key] = reactive(item)
                }
            }
        }
    }else {
        console.warn(`${obj} is not object`)
    }
    return new Proxy(obj, {
        get(obj, key){
            return obj[key]
        },
        set(obj, key, value){
            obj[key] = value
            console.log("更新UI界面")
            return true
        }
    })
}
function ref(obj){
    return reactive({
        value: obj
    })
}

// readonly只须在set中不设置值即可
```

**reactive传入基本数据时，不会创建响应式数据不会监听其变化，并且对其进行赋值操作也不会触发视图的更新。因为proxy是对象的代理**

**ref传入基本或者引用数据都可以，因为他返回的是一个代理对象{val: target}，传入引用其实就是调用reactive**

### 十四、watch跟watchEffect

##### 14.1 watch

想要获取原来的旧值，只能监听对象的xxx属性才行，否则无法获取旧值，或者用计算数据替代此对象，监听计算属性

watch可以监听多个数据

```
// 源码
export function watch<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle
```

```
const state = reactive({
  count: 0,
  name: 'Alice'
});

watch([() => state.count, () => state.name], ([count, name], [oldCount, oldName]) => {
  console.log(`count 从 ${oldCount} 变为 ${count}`);
  console.log(`name 从 ${oldName} 变为 ${name}`);
});

const user = reactive({
  name: 'Alice',
  age: 25
});

const settings = reactive({
  theme: 'light',
  language: 'en'
});

watch({ user, settings }, ({ user, settings }, { oldUser, oldSettings }) => {
  console.log(`用户信息发生变化：${JSON.stringify(oldUser)} -> ${JSON.stringify(user)}`);
  console.log(`设置发生变化：${JSON.stringify(oldSettings)} -> ${JSON.stringify(settings)}`);
});

// 取消监听
```

**取消监听**

```
// 通过调用返回的函数取消监听
const stopWatch = watch(() => state.count, (count) => {
  console.log(`count 变为 ${count}`);
});

// 调用 stopWatch 来取消监听
stopWatch();

// 使用 watch 函数返回的 watcher 对象取消监听
const watcher = watch(() => state.count, (count) => {
  console.log(`count 变为 ${count}`);
});

// 通过调用 watcher 的 unwatch 方法来取消监听
watcher.unwatch();
```

##### 14.2 watchEffect

1. **立即执行，没有惰性，页面的首次加载就会执行。**
2. **没有过多的参数，只有一个回调函数**
3. **自动检测内部代码，代码中有依赖就会执行**
4. **不需要传递要侦听的内容，会自动感知代码依赖**
5. **无法获取到原值，只能得到变化后的值**
6. **异步的操作放在这里会更加合适**
7. **取消监听**

   ```
   const stop = watchEffect(() => {
     console.log(nameObj.name);
     setTimeout(() => {
       stop();
     }, 5000);
   });
   ```
