---
date: 2023-08-01
category:
  - react
tag:
  - 源码
---
react-router源码

<!-- more -->

# 🎯react-router源码

## Hash和History路由模式的实现原理

> **Hash模式：利用hash实现路由切换**

路径前带 `#`就是Hash模式，当 路由地址发生改变，就会触发hashchange，就可以得到当前的路径，就可以渲染对应地址的组件

本质上是改变window.location的href属性；

```
   // 监听URL的改变
    window.addEventListener("hashchange", () => {
      switch (location.hash) {
        case "#/home":
          routerViewEl.innerHTML = "首页";
          break;
        case "#/about":
          routerViewEl.innerHTML = "关于";
          break;
        default:
          routerViewEl.innerHTML = "";
      }
    })
```

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <div>
      <a href="#/a">a</a>
      <a href="#/b">b</a>
    </div>
    <script>
      window.addEventListener('hashchange', () => {
        console.log(window.location.hash);
        let pathname = window.location.hash.slice(1);
        root.innerHTML = pathname;
      });
    </script>
  </body>
</html>

```

> **history模式：利用h5 Api实现路由切换**
>
> **包括两个方法：history.pushState和history.replaceState**
>
> **一个事件：window.onpopstate**

```
<div onclick='pushStateA()'>A</div>
<div onclick='pushStateB()'>B</div>
<div onclick='pushStateC()'>C</div>

function pushStateA() {
    history.pushState({ name: '悟空' }, null, '/a')
}
function pushStateB() {
    history.pushState({ name: '悟空' }, null, '/b')
}
function pushStateC() {
    history.pushState({ name: '悟空' }, null, '/c')
}
```

```
<div onclick='replace()'>/b</div>

function replace() {
history.replaceState({ name: '悟空' }, null, '/b')
 }
```

```
  window.addEventListener('popstate',(event)=>{
       console.log(event)
       //获取到路径
       let pathname = window.location.pathname//获取到路径
       //
       root.innerHTML =  pathname
  })

 function forward() {
     history.forward()//前进
 }
 function  back() {
     history.back()//后退
 }
 function  go(step) {
     history. go(step)//可进可退+1 -1
 }
```

自带的popstate事件可以监听forward，back，go但是不能监听pushState，因为需要手动劫持

```
       //解放方法：函数劫持
        (function(history){
          let oldPushState = history.pushState;//旧的

          history.pushState = function(state,title,pathname){
                let result = oldPushState.apply(history,arguments) //调用旧的  =》 /a

                //添加一个属性
                if(typeof window.onpopstate =='function'){
                    window.onpopstate(new CustomEvent('popstate',{detail:{pathname,state}}))
                }
          }
        })(history)
     
        //使用
        window.onpopstate = (event)=>{
              console.log(666)
              root.innerHTML = window.location.pathname
        }
```
