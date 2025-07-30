import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,c as d,o as a,a as e,e as r,f as t,b as n,d as c}from"./app-CaxZhZIt.js";const v={},o=e("p",null,"大屏适配方案",-1),u=e("h1",{id:"大屏适配方案",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#大屏适配方案","aria-hidden":"true"},"#"),n(" 大屏适配方案")],-1),m=e("p",null,[n("1.先获取一下设计稿的宽高尺寸比 "),e("code",null,"baseProportion"),n("，比如说设计的时候一般按照1920*1080")],-1),b=e("p",null,[n("2.然后封装一个函数 "),e("code",null,"calcRate"),n("，函数中先用window.innerWidth和window.innerHeight计算当前视窗的宽高比 "),e("code",null,"currentRate"),n("。")],-1),h=e("code",null,"transform =",-1),p=e("code",null,"translate()",-1),w={href:"https://developer.mozilla.org/zh-CN/docs/Web/CSS",target:"_blank",rel:"noopener noreferrer"},g=t(`<p>如果当前视窗&gt;设计稿，表示更高，就以当前视窗的宽/设计稿的宽来做基本比，然后给大屏的根节点添加style：<code>transform =</code>scale(\${scale.width}, \${scale.height}) translate(-50%, -50%)\`\`来等比放大，并垂直居中</p><p>3.再封装一个 <code>winDraw</code>函数，给windows增加 <code>onresize</code>事件，监听窗口大小变了就执行 <code>calcRate</code>函数（可以做个防抖）</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { ref, Ref } from &#39;vue&#39;
interface PicType {
  appRef: Ref&lt;HTMLElement&gt;
  calcRate: () =&gt; void
  windowDraw: () =&gt; void
}
export default function useIndex(): PicType {
  // * 指向最外层容器
  const appRef = ref()
  // * 定时函数
  const timer = ref(0)
  // * 默认缩放值
  const scale = {
    width: &#39;1920&#39;,
    height: &#39;1080&#39;
  }
  // * 设计稿尺寸（px）
  const baseWidth = 1920
  const baseHeight = 1080
  // * 需保持的比例（默认1.77778）
  const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
  const calcRate = () =&gt; {
    // 当前宽高比
    const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
    if (appRef.value) {
      if (currentRate &gt; baseProportion) {
        // 表示更宽
        scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
        scale.height = (window.innerHeight / baseHeight).toFixed(5)
        console.log(scale)
        appRef.value.style.transform = \`scale(\${scale.width}, \${scale.height}) translate(-50%, -50%)\`
      } else {
        // 表示更高
        scale.height = (window.innerWidth / baseProportion / baseHeight).toFixed(5)
        scale.width = (window.innerWidth / baseWidth).toFixed(5)
        console.log(scale)

        appRef.value.style.transform = \`scale(\${scale.width}, \${scale.height}) translate(-50%, -50%)\`
      }
    }
  }

  const resize = () =&gt; {
    clearTimeout(timer.value)
    timer.value = setTimeout(() =&gt; {
      calcRate()
    }, 200)
  }

  // 改变窗口大小重新绘制
  const windowDraw = () =&gt; {
    window.addEventListener(&#39;resize&#39;, resize)
  }

  return {
    appRef,
    calcRate,
    windowDraw
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function f(_,x){const i=l("ExternalLinkIcon");return a(),d("div",null,[o,r(" more "),u,m,b,e("p",null,[n("然后比较设计稿和当前视窗的宽高比，如果当前视窗>设计稿，表示更宽，就以当前视窗的高/设计稿的高来做基本比，然后给大屏的根节点添加style："),h,n("scale(${scale.width}, ${scale.height}) translate(-50%, -50%)``来等比放大，并垂直居中（"),p,n(" 这个 "),e("a",w,[n("CSS"),c(i)]),n(" 函数在水平和/或垂直方向上重新定位元素。）")]),g])}const W=s(v,[["render",f],["__file","largeScreen.html.vue"]]);export{W as default};
