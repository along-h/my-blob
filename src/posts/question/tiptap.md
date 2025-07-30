---
date: 2023-11-06
category:
  - 问题案例
---
tiptap在项目中遇到的一些问题记录

<!-- more -->

# tiptap问题记录

tiptap介绍：基于ProseMirror二次封装的富文本编辑器，具有丰富的可扩展性

## 问题描述

原先实例初始化配置项，图片等均在transformPastedHTML事件中处理，但是谷歌浏览器等企业微信中不打开图片直接粘贴进来拿到的img标签的src属性是绝对地址。而safari浏览器不会触发transformPastedHTML事件

```
Not allowed to load local resource: file:///C:/Users/admin/Documents/WMork/168856278529152/Cache/Image/2023-12/ceaabe...png
```

## 原先配置项

```
this.editor = new Editor({
      editorProps: {
        attributes: {
          class: "MyProseMirror",
        },
        // 处理粘贴的文本
        transformPastedText: (html, view) => {
          return html;
        },
        // 处理粘贴的html内容
        transformPastedHTML: (html, view) => {
          // 处理html图片等
          html = this.replaceImg(html, view);
          // google是base64，Safari是img标签
          if(html.includes('data:image') || html.includes('<img')) {
        const curData = html.split('src="')[1].split('"')[0]
         this.getImagePixels(curData)
          }
          return html;
        },
      },
    });
```

## 处理过程思路

翻看ProseMirror官网以及github评论区，灵感来源于github评论区

ProseMirror对于handlePaste描述

```
handlePaste: ?fn(view: EditorView, event: dom.ClipboardEvent, slice: Slice) → bool
// 可以用来覆盖默认的粘贴行为。`slice` 是被编辑器格式化后的粘贴内容，不过你也可以通过直接访问事件对象来获取原始的粘贴内容。
**注:** 粘贴事件中的数据位于 event.dataTransfer 对象上
```

**ProseMirror地址：**[https://prosemirror.xheldon.com/docs/ref/#view.EditorProps.handlePaste](https://prosemirror.xheldon.com/docs/ref/#view.EditorProps.handlePaste)

**github评论区地址：**[https://github.com/ueberdosis/tiptap/issues/4719](https://github.com/ueberdosis/tiptap/issues/4719)

## 处理结果

在tiptap创建Editor实例的时候往editorProps里添加个handlePaste方法，这里面能获取到windows.paste的event对象，里面有粘贴的相应的图片，获取到后，通过Editor实例上相应的方法设置图片，并在transformPastedHTML事件中将图片的html内容返回为空，防止重复粘贴图片

```
this.editor = new Editor({
  editorProps: {
     handlePaste:  (view, event, slice) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (let index = 0; index < items.length; index++) {
        // 图片在此处处理，其他的不处理
        if(items[index].getAsFile()) {
          const reader = new FileReader()
          reader.readAsDataURL(items[index].getAsFile())
          reader.onload = () => {
            this.editor?.commands.setImage({
                src: reader.result,
               datekey: new Date().getTime()
            })
          }
        }
      }
    },
    transformPastedHTML: (html, view) => {
      // 进行相应的处理，如果匹配到的html是图片类型的则返回空，防止重复粘贴
      // 以下为举例，具体的根据相应业务分析
      if(html.includes('<img')) {
        return ''
      } else {
        return html;
      }    
    },
  },
});
```
