import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as i,a as t,e as s,f as l}from"./app-CaxZhZIt.js";const d={},a=t("p",null,"react-router源码",-1),r=l(`<h1 id="🎯react-router源码" tabindex="-1"><a class="header-anchor" href="#🎯react-router源码" aria-hidden="true">#</a> 🎯react-router源码</h1><h2 id="hash和history路由模式的实现原理" tabindex="-1"><a class="header-anchor" href="#hash和history路由模式的实现原理" aria-hidden="true">#</a> Hash和History路由模式的实现原理</h2><blockquote><p><strong>Hash模式：利用hash实现路由切换</strong></p></blockquote><p>路径前带 <code>#</code>就是Hash模式，当 路由地址发生改变，就会触发hashchange，就可以得到当前的路径，就可以渲染对应地址的组件</p><p>本质上是改变window.location的href属性；</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>   // 监听URL的改变
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot; /&gt;
    &lt;link rel=&quot;icon&quot; type=&quot;image/svg+xml&quot; href=&quot;src/favicon.svg&quot; /&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot; /&gt;
    &lt;title&gt;Vite App&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id=&quot;root&quot;&gt;&lt;/div&gt;
    &lt;div&gt;
      &lt;a href=&quot;#/a&quot;&gt;a&lt;/a&gt;
      &lt;a href=&quot;#/b&quot;&gt;b&lt;/a&gt;
    &lt;/div&gt;
    &lt;script&gt;
      window.addEventListener(&#39;hashchange&#39;, () =&gt; {
        console.log(window.location.hash);
        let pathname = window.location.hash.slice(1);
        root.innerHTML = pathname;
      });
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>history模式：利用h5 Api实现路由切换</strong></p><p><strong>包括两个方法：history.pushState和history.replaceState</strong></p><p><strong>一个事件：window.onpopstate</strong></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div onclick=&#39;pushStateA()&#39;&gt;A&lt;/div&gt;
&lt;div onclick=&#39;pushStateB()&#39;&gt;B&lt;/div&gt;
&lt;div onclick=&#39;pushStateC()&#39;&gt;C&lt;/div&gt;

function pushStateA() {
    history.pushState({ name: &#39;悟空&#39; }, null, &#39;/a&#39;)
}
function pushStateB() {
    history.pushState({ name: &#39;悟空&#39; }, null, &#39;/b&#39;)
}
function pushStateC() {
    history.pushState({ name: &#39;悟空&#39; }, null, &#39;/c&#39;)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;div onclick=&#39;replace()&#39;&gt;/b&lt;/div&gt;

function replace() {
history.replaceState({ name: &#39;悟空&#39; }, null, &#39;/b&#39;)
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  window.addEventListener(&#39;popstate&#39;,(event)=&gt;{
       console.log(event)
       //获取到路径
       let pathname = window.location.pathname//获取到路径
       //
       root.innerHTML =  pathname
  })

 function forward() {
     history.forward()//前进
 }
 function  back() {
     history.back()//后退
 }
 function  go(step) {
     history. go(step)//可进可退+1 -1
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>自带的popstate事件可以监听forward，back，go但是不能监听pushState，因为需要手动劫持</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>       //解放方法：函数劫持
        (function(history){
          let oldPushState = history.pushState;//旧的

          history.pushState = function(state,title,pathname){
                let result = oldPushState.apply(history,arguments) //调用旧的  =》 /a

                //添加一个属性
                if(typeof window.onpopstate ==&#39;function&#39;){
                    window.onpopstate(new CustomEvent(&#39;popstate&#39;,{detail:{pathname,state}}))
                }
          }
        })(history)
     
        //使用
        window.onpopstate = (event)=&gt;{
              console.log(666)
              root.innerHTML = window.location.pathname
        }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13);function v(u,c){return i(),n("div",null,[a,s(" more "),r])}const b=e(d,[["render",v],["__file","router.html.vue"]]);export{b as default};
