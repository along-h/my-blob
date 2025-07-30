import{_ as d}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r,c as t,o as l,a as e,e as c,f as a,b as n,d as s}from"./app-CaxZhZIt.js";const v={},o=e("p",null,"tiptap在项目中遇到的一些问题记录",-1),m=a(`<h1 id="tiptap问题记录" tabindex="-1"><a class="header-anchor" href="#tiptap问题记录" aria-hidden="true">#</a> tiptap问题记录</h1><p>tiptap介绍：基于ProseMirror二次封装的富文本编辑器，具有丰富的可扩展性</p><h2 id="问题描述" tabindex="-1"><a class="header-anchor" href="#问题描述" aria-hidden="true">#</a> 问题描述</h2><p>原先实例初始化配置项，图片等均在transformPastedHTML事件中处理，但是谷歌浏览器等企业微信中不打开图片直接粘贴进来拿到的img标签的src属性是绝对地址。而safari浏览器不会触发transformPastedHTML事件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Not allowed to load local resource: file:///C:/Users/admin/Documents/WMork/168856278529152/Cache/Image/2023-12/ceaabe...png
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="原先配置项" tabindex="-1"><a class="header-anchor" href="#原先配置项" aria-hidden="true">#</a> 原先配置项</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>this.editor = new Editor({
      editorProps: {
        attributes: {
          class: &quot;MyProseMirror&quot;,
        },
        // 处理粘贴的文本
        transformPastedText: (html, view) =&gt; {
          return html;
        },
        // 处理粘贴的html内容
        transformPastedHTML: (html, view) =&gt; {
          // 处理html图片等
          html = this.replaceImg(html, view);
          // google是base64，Safari是img标签
          if(html.includes(&#39;data:image&#39;) || html.includes(&#39;&lt;img&#39;)) {
        const curData = html.split(&#39;src=&quot;&#39;)[1].split(&#39;&quot;&#39;)[0]
         this.getImagePixels(curData)
          }
          return html;
        },
      },
    });
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="处理过程思路" tabindex="-1"><a class="header-anchor" href="#处理过程思路" aria-hidden="true">#</a> 处理过程思路</h2><p>翻看ProseMirror官网以及github评论区，灵感来源于github评论区</p><p>ProseMirror对于handlePaste描述</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>handlePaste: ?fn(view: EditorView, event: dom.ClipboardEvent, slice: Slice) → bool
// 可以用来覆盖默认的粘贴行为。\`slice\` 是被编辑器格式化后的粘贴内容，不过你也可以通过直接访问事件对象来获取原始的粘贴内容。
**注:** 粘贴事件中的数据位于 event.dataTransfer 对象上
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),u=e("strong",null,"ProseMirror地址：",-1),h={href:"https://prosemirror.xheldon.com/docs/ref/#view.EditorProps.handlePaste",target:"_blank",rel:"noopener noreferrer"},b=e("strong",null,"github评论区地址：",-1),p={href:"https://github.com/ueberdosis/tiptap/issues/4719",target:"_blank",rel:"noopener noreferrer"},g=a(`<h2 id="处理结果" tabindex="-1"><a class="header-anchor" href="#处理结果" aria-hidden="true">#</a> 处理结果</h2><p>在tiptap创建Editor实例的时候往editorProps里添加个handlePaste方法，这里面能获取到windows.paste的event对象，里面有粘贴的相应的图片，获取到后，通过Editor实例上相应的方法设置图片，并在transformPastedHTML事件中将图片的html内容返回为空，防止重复粘贴图片</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>this.editor = new Editor({
  editorProps: {
     handlePaste:  (view, event, slice) =&gt; {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (let index = 0; index &lt; items.length; index++) {
        // 图片在此处处理，其他的不处理
        if(items[index].getAsFile()) {
          const reader = new FileReader()
          reader.readAsDataURL(items[index].getAsFile())
          reader.onload = () =&gt; {
            this.editor?.commands.setImage({
                src: reader.result,
               datekey: new Date().getTime()
            })
          }
        }
      }
    },
    transformPastedHTML: (html, view) =&gt; {
      // 进行相应的处理，如果匹配到的html是图片类型的则返回空，防止重复粘贴
      // 以下为举例，具体的根据相应业务分析
      if(html.includes(&#39;&lt;img&#39;)) {
        return &#39;&#39;
      } else {
        return html;
      }    
    },
  },
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function x(f,_){const i=r("ExternalLinkIcon");return l(),t("div",null,[o,c(" more "),m,e("p",null,[u,e("a",h,[n("https://prosemirror.xheldon.com/docs/ref/#view.EditorProps.handlePaste"),s(i)])]),e("p",null,[b,e("a",p,[n("https://github.com/ueberdosis/tiptap/issues/4719"),s(i)])]),g])}const E=d(v,[["render",x],["__file","tiptap.html.vue"]]);export{E as default};
