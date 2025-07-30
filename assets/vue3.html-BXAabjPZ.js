import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as d,o as s,a as e,e as a,f as n,b as r,t as l}from"./app-CaxZhZIt.js";const t={},c=e("p",null,"Vue3相关知识点以及对比Vue2优势",-1),v=n('<h1 id="vue3" tabindex="-1"><a class="header-anchor" href="#vue3" aria-hidden="true">#</a> Vue3</h1><h2 id="一、vue3的性能提升方便" tabindex="-1"><a class="header-anchor" href="#一、vue3的性能提升方便" aria-hidden="true">#</a> 一、Vue3的性能提升方便</h2><h3 id="_1-编译阶段优化" tabindex="-1"><a class="header-anchor" href="#_1-编译阶段优化" aria-hidden="true">#</a> 1. 编译阶段优化</h3><p>回顾Vue2，我们知道每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把用到的数据property记录为依赖，当依赖发生改变，触发setter，则会通知watcher，从而使关联的组件重新渲染。</p><h5 id="_1-1-diff算法优化" tabindex="-1"><a class="header-anchor" href="#_1-1-diff算法优化" aria-hidden="true">#</a> 1.1 diff算法优化</h5><p>vue2是采用的双端交叉指针，队头与队头、队尾与队尾、队头与队尾、队尾与队头，对比4次，4次寻找到key相同，就会进行复用，进行移动位置，4次都没匹配到会采用暴力比对的方式，在新的vdom的队头开始依次再去寻找老的vdom里有没有一样的，有的话进行相应的移动，最后新的有多的话直接插入，老的有多的话进行删除。</p><p>vue3是双端快速diff，只对比两种情况，队头与队头、队尾与队尾，如果能匹配上与vue2一致，没有匹配上的话会进行最长递增子序列的计算（为了寻找最小的dom移动），在新的vdom中寻找依次递增的元素有哪些，那这些元素的顺序就是固定的，去寻找不在这些列表里的元素和老的vdom进行对比再进行相应的移动、创建、删除。另外相比vue2增加了静态标记，其作用是为了会发生变化的地方添加一个flag标记，下次发生变化的时候直接找该地方进行比较。（可看b站哲玄前端）</p><h5 id="_1-2-静态提升" tabindex="-1"><a class="header-anchor" href="#_1-2-静态提升" aria-hidden="true">#</a> 1.2 静态提升</h5><p>Vue3中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用。免去了重复的创建操作，优化内存。</p><h5 id="_1-3-事件监听缓存" tabindex="-1"><a class="header-anchor" href="#_1-3-事件监听缓存" aria-hidden="true">#</a> 1.3 事件监听缓存</h5><p>默认情况下绑定事件行为会被视为动态绑定（没开启事件监听器缓存），所以每次都会去追踪它的变化。开启事件侦听器缓存后，没有了静态标记。也就是说下次diff算法的时候可以直接使用</p><h5 id="_1-4-ssr优化" tabindex="-1"><a class="header-anchor" href="#_1-4-ssr优化" aria-hidden="true">#</a> 1.4 SSR优化</h5><p>当静态内容大到一定量级时候，会用createStaticVNode方法在客户端去生成一个static node，这些静态node，会被直接innerHtml，就不需要创建对象，然后根据对象渲染</p><h3 id="_2-源码体积" tabindex="-1"><a class="header-anchor" href="#_2-源码体积" aria-hidden="true">#</a> 2.源码体积</h3><p>相比Vue2，Vue3整体体积变小了，除了移出一些不常用的API。任何一个函数，如ref、reavtived、computed等，仅仅在用到的时候才打包，没用到的模块都被摇掉，打包的整体体积变小。（利用了Tree shanking）</p><h3 id="_3-响应式系统" tabindex="-1"><a class="header-anchor" href="#_3-响应式系统" aria-hidden="true">#</a> 3.响应式系统</h3><p>vue2中采用 defineProperty来劫持整个对象，然后进行深度遍历所有属性，给每个属性添加getter和setter，实现响应式。</p><p>vue3采用proxy重写了响应式系统，因为proxy可以对整个对象进行监听，所以不需要深度遍历。</p><h2 id="二、vue3为什么要用proxy代替defineproperty" tabindex="-1"><a class="header-anchor" href="#二、vue3为什么要用proxy代替defineproperty" aria-hidden="true">#</a> 二、Vue3为什么要用Proxy代替defineProperty</h2><p><strong>1、</strong><code>vue2</code>中采用 <code>defineProperty</code>来劫持整个对象，然后进行深度遍历所有属性，给每个属性添加getter和setter，实现响应式。但是存在以下的问题：</p><ol><li><strong>检测不到对象属性的添加和删除</strong></li><li><strong>数组API方法无法监听到</strong></li><li><strong>需要对每个属性进行遍历监听，如果嵌套对象还需要深度监听，会造成性能问题</strong></li></ol><p><strong>2、proxy：监听是针对一个对象的，那么对这个对象的所有操作会进入监听操作。</strong></p><ol><li><strong>Object.defineProperty只能遍历对象属性进行劫持</strong></li><li><strong>Proxy直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的</strong></li><li><strong>Proxy可以直接监听数组的变化（push、shift、splice）</strong></li><li><strong>Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等，这是Object.defineProperty不具备的</strong></li></ol><h2 id="三、vue3-0性能提升主要是通过哪几方面体现的" tabindex="-1"><a class="header-anchor" href="#三、vue3-0性能提升主要是通过哪几方面体现的" aria-hidden="true">#</a> 三、Vue3.0性能提升主要是通过哪几方面体现的</h2><h5 id="_1-1-编译阶段优化" tabindex="-1"><a class="header-anchor" href="#_1-1-编译阶段优化" aria-hidden="true">#</a> 1.1 编译阶段优化</h5><p><strong>回顾 <code>Vue2</code>，我们知道每个组件实例都对应一个 <code>watcher 实例</code>，它会在组件渲染的过程中把用到的数据 <code>property</code>记录为依赖，当依赖发生改变，触发 <code>setter</code>，则会通知 <code>watcher</code>，从而使关联的组件重新渲染。</strong> 因此，<code>Vue3</code>在编译阶段，做了进一步优化：</p><ol><li><strong>diff算法优化：</strong><code>vue3</code>在 <code>diff</code>算法中相比 <code>vue2</code>增加了 <code>静态标记</code>，其作用是为了会发生变化的地方添加一个 <code>flag标记</code>，下次发生变化的时候 <code>直接</code>找该地方进行比较。</li><li><strong>静态提升：Vue3中对</strong> <code>不参与更新</code>的元素，会做静态提升，<code>只会被创建一次</code>，在渲染时直接复用。免去了重复的创建操作，优化内存</li><li><strong>事件监听缓存：默认情况下绑定事件行为会被视为动态绑定（</strong><code>没开启事件监听器缓存</code>），所以 <code>每次</code>都会去追踪它的变化。<code>开启事件侦听器缓存</code>后，没有了静态标记。也就是说下次 <code>diff算法</code>的时候 <code>直接使用</code>。</li><li><strong>SSR优化：当静态内容大到一定量级时候，会用</strong> <code>createStaticVNode</code>方法在客户端去生成一个 <code>static node</code>，这些 <code>静态node</code>，会被直接 <code>innerHtml</code>，就不需要创建对象，然后根据对象渲染。</li></ol><h5 id="_1-2-源码体积" tabindex="-1"><a class="header-anchor" href="#_1-2-源码体积" aria-hidden="true">#</a> 1.2 源码体积</h5><p>相比 <code>Vue2</code>，<code>Vue3</code>整体体积 <code>变小</code>了，除了移出一些 <code>不常用的API</code>，最重要的是引入 <code>Tree shanking</code>。任何一个函数，如 <code>ref、reavtived、computed</code>等，仅仅在 <code>用到</code>的时候才 <code>打包</code>，<code>没用到</code>的模块都 <code>被摇掉</code>，打包的整体体积 <code>变小</code>。</p><h5 id="_1-3-响应式系统" tabindex="-1"><a class="header-anchor" href="#_1-3-响应式系统" aria-hidden="true">#</a> 1.3 响应式系统</h5><p><code>vue2</code>中采用 <code>defineProperty</code>来劫持整个对象，然后进行深度遍历所有属性，给 <code>每个属性</code>添加 <code>getter和setter</code>，实现响应式。<code>vue3</code>采用 <code>proxy</code>重写了响应式系统，因为 <code>proxy</code>可以对 <code>整个对象进行监听</code>，所以不需要深度遍历。</p><ul><li><strong>可以监听动态属性的添加</strong></li><li><strong>可以监听到数组的索引和数组length属性</strong></li><li><strong>可以监听删除属性</strong></li></ul><h2 id="四、vue2双向绑定与mvvm" tabindex="-1"><a class="header-anchor" href="#四、vue2双向绑定与mvvm" aria-hidden="true">#</a> 四、Vue2双向绑定与MVVM</h2><h5 id="_4-1-双向绑定" tabindex="-1"><a class="header-anchor" href="#_4-1-双向绑定" aria-hidden="true">#</a> 4.1 双向绑定</h5>',34),o=e("strong",null,"Vue实现数据双向绑定的原理：Object.defineProperty（）",-1),u=e("strong",null,"vue实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty（）来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调。",-1),b=n(`<h4 id="_4-2-mvvm" tabindex="-1"><a class="header-anchor" href="#_4-2-mvvm" aria-hidden="true">#</a> 4.2 MVVM</h4><p>MVVM分为view层（DOM）model层（数据）ViewModel（Vue实例），view与model层通过viewModel进行连接，viewmodel通过双向绑定监听两边的变化去实现view与model的同步，viewmodel中就是vue2的双向绑定原理，数据劫持结合发布者-订阅者模式。</p><p>vue则是采用发布者-订阅者模式，通过Object.defineProperty()来劫持各个属性的getter和setter，在数据变动时发布消息给订阅者，触发相应的监听回调。</p><h2 id="五、获取data中某一状态初始值" tabindex="-1"><a class="header-anchor" href="#五、获取data中某一状态初始值" aria-hidden="true">#</a> 五、获取data中某一状态初始值</h2><p><strong>可以通过this.$options.data().keyname来获取初始</strong></p><h2 id="六、动态给vue的data添加一个新的属性时为什么不刷新" tabindex="-1"><a class="header-anchor" href="#六、动态给vue的data添加一个新的属性时为什么不刷新" aria-hidden="true">#</a> 六、动态给vue的data添加一个新的属性时为什么不刷新</h2><p>一开始data里面的obj的属性会被设成了响应式数据，而后面新增的属性，并没有通过Object.defineProperty设置成响应式数据。</p><p>解决方法：</p><ol><li><strong>vue.set()</strong></li><li><strong>Object.assign()，需创建一个空对象进行合并</strong></li><li><strong>this.$forceUpdated</strong></li></ol><p><strong>注意：Vue3中利用proxy实现数据响应，动态添加仍可以刷新</strong></p><h2 id="七、reactive源码" tabindex="-1"><a class="header-anchor" href="#七、reactive源码" aria-hidden="true">#</a> 七、reactive源码</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function reactive(obj) {
    if (typeof obj !== &#39;object&#39; &amp;&amp; obj != null) {
        return obj
    }
    // Proxy相当于在对象外层加拦截
    const observed = new Proxy(obj, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver)
            console.log(\`获取\${key}:\${res}\`)
            return res
        },
        set(target, key, value, receiver) {
            const res = Reflect.set(target, key, value, receiver)
            console.log(\`设置\${key}:\${value}\`)
            return res
        },
        deleteProperty(target, key) {
            const res = Reflect.deleteProperty(target, key)
            console.log(\`删除\${key}:\${res}\`)
            return res
        }
    })
    return observed
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、vue3-0编译做了哪一些优化" tabindex="-1"><a class="header-anchor" href="#八、vue3-0编译做了哪一些优化" aria-hidden="true">#</a> 八、vue3.0编译做了哪一些优化</h2><ol><li><strong>静态树提升： Vue 3.0 通过重写编译器，实现对静态节点（即不改变的节点）进行编译优化，使用HoistStatic功能将静态节点移动到 render 函数外部进行缓存，从而服务端渲染和提高前端渲染的性能。</strong></li><li><strong>Patch Flag：在Vue 3.0中，编译的生成vnode会根据节点patch的标记，只对需要重新渲染的数据进行响应式更新，不需要更新的数据不会重新渲染，从而大大提高了渲染性能。</strong></li><li><strong>静态属性提升：Vue3中对</strong> <code>不参与更新</code>的元素，会做静态提升，<code>只会被创建一次</code>，在渲染时直接复用。免去了重复的创建操作，优化内存。 没做静态提升之前，未参与更新的元素也在 <code>render函数</code>内部，会重复 <code>创建阶段</code>。** **做了静态提升后，未参与更新的元素，被 <code>放置在render 函数外</code>，每次渲染的时候只要 <code>取出</code>即可。同时该元素会被打上 <code>静态标记值为-1</code>，特殊标志是 <code>负整数</code>表示永远不会用于 <code>Diff</code>。</li><li><code>事件监听缓存</code>：默认情况下绑定事件行为会被视为动态绑定（<code>没开启事件监听器缓存</code>），所以 <code>每次</code>都会去追踪它的变化。<code>开启事件侦听器缓存</code>后，没有了静态标记。也就是说下次 <code>diff算法</code>的时候 <code>直接使用</code>。</li></ol><h3 id="九、mixin" tabindex="-1"><a class="header-anchor" href="#九、mixin" aria-hidden="true">#</a> 九、mixin</h3><h5 id="_9-1-冲突处理特点" tabindex="-1"><a class="header-anchor" href="#_9-1-冲突处理特点" aria-hidden="true">#</a> 9.1 冲突处理特点</h5><ol><li><strong>当组件和mixin同时定义生命周期选项,两个都会触发,而且mixin会先触发</strong></li><li><strong>如果组件和mixin同时定义相同方法,会使用组件方法,会覆盖mixin</strong></li><li><strong>如果组件和mixin同时定义相同计算属性,会使用组件方法,会覆盖mixin</strong></li></ol><h5 id="_9-2-优缺点" tabindex="-1"><a class="header-anchor" href="#_9-2-优缺点" aria-hidden="true">#</a> 9.2 优缺点</h5><p><strong>优点</strong></p><ul><li><strong>提高代码复用性和可维护性。</strong></li><li><strong>使组件更易于测试和理解。</strong></li><li><strong>允许您在多个组件之间共享和重用代码</strong></li></ul><p><strong>缺点</strong></p><ul><li><strong>Mixins 可能会引入命名冲突和重复代码。</strong></li><li><strong>Mixins 可能会导致组件之间的依赖关系不清晰。</strong></li></ul><h3 id="十、vue2跟vue3响应式原理" tabindex="-1"><a class="header-anchor" href="#十、vue2跟vue3响应式原理" aria-hidden="true">#</a> 十、vue2跟vue3响应式原理</h3><p><strong>Observer-----监听函数</strong></p><p><strong>defineProperty ---- 定义属性，增加getter、setter</strong></p><h5 id="_10-1-vue2" tabindex="-1"><a class="header-anchor" href="#_10-1-vue2" aria-hidden="true">#</a> 10.1 vue2</h5><p><strong>数组</strong></p><p>vue2数组的响应式是通过重写数组原型上的 7 个方法来实现，其实Object.defineProperty可以监听到数组的变化，但是这么做会导致性能很差，性能和用户体验收益不成正比，因为数组的长度往往会很长。</p><h5 id="vue-无法监听数组变化的场景" tabindex="-1"><a class="header-anchor" href="#vue-无法监听数组变化的场景" aria-hidden="true">#</a> vue 无法监听数组变化的场景</h5><ol><li><strong>通过数组索引改变数组元素的值；</strong></li><li><strong>改变数组的长度</strong></li></ol><p><strong>对象</strong></p><p>vue2中对象的响应式是只有第一层的，代码实现看observer</p><h5 id="_10-3-compile" tabindex="-1"><a class="header-anchor" href="#_10-3-compile" aria-hidden="true">#</a> 10.3 Compile</h5><p>1、判断el是不是元素节点，如果不是，就要取到el这个标签，然后传入vm实例</p><p>2、递归拿到所有子节点，便于下一步去解析它们。【注意：这一步会频繁触发页面的回流和重绘，所以我们需要把节点先存入文档碎片对象中，就相当于把他们放到了内存中，减少了页面的回流和重绘。】</p><p>3、在文档碎片对象中编译好模板；</p><p>4、最后再把文档碎片对象追加到根元素上。</p><h5 id="_10-4-updater" tabindex="-1"><a class="header-anchor" href="#_10-4-updater" aria-hidden="true">#</a> 10.4 Updater</h5><p>作用：更新试图</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 更新的函数
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_10-5-observer-数据劫持" tabindex="-1"><a class="header-anchor" href="#_10-5-observer-数据劫持" aria-hidden="true">#</a> 10.5 Observer，数据劫持</h5><p>1、递归，将data中所有的属性、对象、子对象……都遍历出来</p><p>2、对每个key，使用Object.defineProperty劫持数据（Object.defineProperty()的作用就是直接在一个对象上定义一个新属性，或者修改一个已经存在的属性）</p><p>3、Object.defineProperty下有get方法和set方法，也就是官方原理图上的getter和stter啦</p><p>4、在劫持数据之前，创建依赖器Dep实例dep</p><p>5、对于gettter，订阅数据变化时，往dep中添加观察者；</p><p>6、对于setter，当数据变化时，将newVal赋值为新值，并用notify通知dep变化。（此处正好对应官方原理图）</p><p>4、5、6这最后三点可以说是MVVM实现中最关键、最巧妙的3步，正是这画龙点睛的三笔，把整个系统桥梁成功架起来，注意它们各自放置在代码中位置。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 用于监听数据类型，不同类型进行不同处理
function Observer(target){
// 判断，如果是基本类型，直接返回
// Object.definePrototype只能针对 对象做处理
if(typeof target != &#39;object&#39; || typeof target != &#39;array&#39;){
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
console.log(key + &#39;getter被调用...&#39;)
return value
},
set(newV){
console.log(key + &#39;setter方法被调用...&#39;)
if(newV !== value){
value = newV
// 假设我定义的有render()方法...
// 通知视图更新.........
render()
}
}
})
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_10-6-dep数据依赖器" tabindex="-1"><a class="header-anchor" href="#_10-6-dep数据依赖器" aria-hidden="true">#</a> 10.6 Dep数据依赖器</h5><p><strong>主要作用：</strong></p><ol><li>收集要更新的观察者</li><li>通知每个观察者去更新</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 数据依赖器
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
        console.log(&quot;通知了观察者&quot;, this.subs);
        this.subs.forEach(w =&gt;w.update())
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_10-7-watcher观察者" tabindex="-1"><a class="header-anchor" href="#_10-7-watcher观察者" aria-hidden="true">#</a> 10.7 Watcher观察者</h5><p><strong>注意</strong> <code>Dep.target = this;</code>这一步，是为了把观察者挂载到Dep实例上，关联起来。所以当观察者Watcher获取旧值后，应该解除关联，否则会重复地添加观察者。最后，使用callback回调函数传递要处理的新值给Updater即可。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class Watcher {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="十一、forceupdate原理" tabindex="-1"><a class="header-anchor" href="#十一、forceupdate原理" aria-hidden="true">#</a> 十一、forceUpdate原理</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
        vm._watcher.update()
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="十二、shallowreactive、shallowref、shallowreadonly" tabindex="-1"><a class="header-anchor" href="#十二、shallowreactive、shallowref、shallowreadonly" aria-hidden="true">#</a> 十二、shallowReactive、shallowRef、shallowReadonly</h3><p><strong>只对第一层进行代理</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function shallowReactive(obj){
    return new Proxy(obj, {
        get(obj, key){
            return obj[key]
        },
        set(obj, key, val){
            obj[key] = val
            console.log(&quot;更新UI界面&quot;)
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
            console.warn(\`\${key} 只读，不能赋值\`)
            return true
        }
    })
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="十三、reactive、ref、readonly" tabindex="-1"><a class="header-anchor" href="#十三、reactive、ref、readonly" aria-hidden="true">#</a> 十三、reactive、ref、readonly</h3><p><strong>需要把所有的对象进行代理</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 产生递归监听
function reactive(obj){
    if(typeof obj === &quot;object&quot;){
        if(obj instanceof Array){
            // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
            // 如果又是一个对象需要包装成一个proxy
            obj.forEach((item, index) =&gt; {
                if(typeof item === &quot;object&quot;){
                    obj[index] = reactive(item)
                }
            })
        }else {
            // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
            for (const key in obj) {
                let item = obj[key]
                if(typeof item === &quot;object&quot;){
                    obj[key] = reactive(item)
                }
            }
        }
    }else {
        console.warn(\`\${obj} is not object\`)
    }
    return new Proxy(obj, {
        get(obj, key){
            return obj[key]
        },
        set(obj, key, value){
            obj[key] = value
            console.log(&quot;更新UI界面&quot;)
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>reactive传入基本数据时，不会创建响应式数据不会监听其变化，并且对其进行赋值操作也不会触发视图的更新。因为proxy是对象的代理</strong></p><p><strong>ref传入基本或者引用数据都可以，因为他返回的是一个代理对象{val: target}，传入引用其实就是调用reactive</strong></p><h3 id="十四、watch跟watcheffect" tabindex="-1"><a class="header-anchor" href="#十四、watch跟watcheffect" aria-hidden="true">#</a> 十四、watch跟watchEffect</h3><h5 id="_14-1-watch" tabindex="-1"><a class="header-anchor" href="#_14-1-watch" aria-hidden="true">#</a> 14.1 watch</h5><p>想要获取原来的旧值，只能监听对象的xxx属性才行，否则无法获取旧值，或者用计算数据替代此对象，监听计算属性</p><p>watch可以监听多个数据</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 源码
export function watch&lt;
  T extends MultiWatchSources,
  Immediate extends Readonly&lt;boolean&gt; = false
&gt;(
  sources: [...T],
  cb: WatchCallback&lt;MapSources&lt;T, false&gt;, MapSources&lt;T, Immediate&gt;&gt;,
  options?: WatchOptions&lt;Immediate&gt;
): WatchStopHandle
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const state = reactive({
  count: 0,
  name: &#39;Alice&#39;
});

watch([() =&gt; state.count, () =&gt; state.name], ([count, name], [oldCount, oldName]) =&gt; {
  console.log(\`count 从 \${oldCount} 变为 \${count}\`);
  console.log(\`name 从 \${oldName} 变为 \${name}\`);
});

const user = reactive({
  name: &#39;Alice&#39;,
  age: 25
});

const settings = reactive({
  theme: &#39;light&#39;,
  language: &#39;en&#39;
});

watch({ user, settings }, ({ user, settings }, { oldUser, oldSettings }) =&gt; {
  console.log(\`用户信息发生变化：\${JSON.stringify(oldUser)} -&gt; \${JSON.stringify(user)}\`);
  console.log(\`设置发生变化：\${JSON.stringify(oldSettings)} -&gt; \${JSON.stringify(settings)}\`);
});

// 取消监听
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>取消监听</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 通过调用返回的函数取消监听
const stopWatch = watch(() =&gt; state.count, (count) =&gt; {
  console.log(\`count 变为 \${count}\`);
});

// 调用 stopWatch 来取消监听
stopWatch();

// 使用 watch 函数返回的 watcher 对象取消监听
const watcher = watch(() =&gt; state.count, (count) =&gt; {
  console.log(\`count 变为 \${count}\`);
});

// 通过调用 watcher 的 unwatch 方法来取消监听
watcher.unwatch();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_14-2-watcheffect" tabindex="-1"><a class="header-anchor" href="#_14-2-watcheffect" aria-hidden="true">#</a> 14.2 watchEffect</h5><ol><li><p><strong>立即执行，没有惰性，页面的首次加载就会执行。</strong></p></li><li><p><strong>没有过多的参数，只有一个回调函数</strong></p></li><li><p><strong>自动检测内部代码，代码中有依赖就会执行</strong></p></li><li><p><strong>不需要传递要侦听的内容，会自动感知代码依赖</strong></p></li><li><p><strong>无法获取到原值，只能得到变化后的值</strong></p></li><li><p><strong>异步的操作放在这里会更加合适</strong></p></li><li><p><strong>取消监听</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const stop = watchEffect(() =&gt; {
  console.log(nameObj.name);
  setTimeout(() =&gt; {
    stop();
  }, 5000);
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol>`,76);function m(h,p){return s(),d("div",null,[c,a(" more "),v,e("p",null,[o,u,r(" vue的数据双向绑定 将MVVM作为数据绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听自己的model的数据变化，通过Compile来解析编译模板指令（vue中是用来解析 "+l()+"），最终利用watcher搭起observer和Compile之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据model变更双向绑定效果。",1)]),b])}const x=i(t,[["render",m],["__file","vue3.html.vue"]]);export{x as default};
