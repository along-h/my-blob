---
date: 2023-09-15
category:
  - react
tag:
  - 源码
---
React.dom相关源码

<!-- more -->

# 🎯虚拟DOM和ReactDOM.render源码

## React的DOM渲染过程

> JSX经过babel编译成React.createElement方法，生成虚拟DOM—vnode，再经过render渲染成真实DOM

```
import React from './React';
import ReactDOM from './react-dom';

let element = React.createElement(
  'h1',
  {
    className: 'title',
    style: {
      color: 'green',
    },
  },
  React.createElement('span', null, 666),
);

const FunctionCpn = (props) => {
  return React.createElement('h1', { style: { color: 'blue' } }, 123, props.name);
};

const element2 = <FunctionCpn name="100"></FunctionCpn>;

console.log(element);

ReactDOM.render(element2, document.getElementById('root'));
```

可以看到vnode的props中存储了JSX中的数据，当标签内的children只有一个时，以****字符串保存；当有多个时，以数组形式保存。children也是JSX时，则以对象形式保存

## React.createElement源码

```
import { REACT_ELEMENT } from './constants';
import { toObjFn } from './utils';
🧲
function createElement(type, config, ...children) {
  let key, ref;
  let props = { ...config };
  if (config) {
    key = config.key;
    ref = config.ref;
    delete config.key;
    delete config.ref;
  }
  //有多个儿子
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(toObjFn); //截取arguments第三位开始的所有 []
  }
  //只有一个儿子
  if (arguments.length == 3) {
    props.children = toObjFn(children[0]);
  }

  return {
    //vnode
    $$typeof: REACT_ELEMENT,
    key, //diff
    ref, //获取真实DOM
    type, //类型 div
    props,
  };
}

const React = {
  createElement,
};

export default React;
```

## ReactDOM.render源码

真实dom

处理props

处理children

函数式组件的vnode的type，会被浏览器处理成一个函数，调用即可生成函数式组件的虚拟DOM

```
import { REACT_TEXT } from './constants';

🧲//初始化react元素
const render = (vdom, container) => {
  //1 vdom=>真实dom
  let newDom = createDom(vdom);
  //2 真实dom放到对应节点
  container.appendChild(newDom);
};
🧲//vdom=>真实dom
const createDom = (vdom) => {
  let { type, props, content } = vdom;
  let dom; //真实dom
  //forwardRef
  if (type && type.$$typeof) {
    return mountForWardRef(vdom);
  }
  //1 判断type是文本（string/number）或者元素div
  else if (type == REACT_TEXT) {
    dom = document.createTextNode(content);
  } else if (typeof type == 'function') {
    return mountFunctionCpn(vdom);
  } else {
    dom = document.createElement(type);
  }
  //2 添加props
  if (props) {
    //新旧props产生的更新
    updateProps(dom, {}, props); //真实dom/旧props/新props
    //3 children
    let children = props.children;
    if (children) {
      changeChildren(children, dom);
    }
  }
  //返回真实dom
  return dom;
};
🧲//处理函数式组件
const mountFunctionCpn = (vdom) => {
  let { type, props } = vdom;
  let functionVdom = type(props);
  return createDom(functionVdom);
};
🧲//处理forwardRef
const mountForWardRef = (vdom) => {
  let { type, props, ref } = vdom;
  let refVnode = type.render(props, ref); //函数式组件
  return createDom(refVnode);
};
🧲//处理children
const changeChildren = (children, dom) => {
  //1.一个children ,对象格式
  if (typeof children === 'object' && children.type) {
    render(children, dom);
  } else if (Array.isArray(children)) {
    children.forEach((item) => render(item, dom));
  }
  //2.多个children ,数组格式
};

🧲//更新props
const updateProps = (dom, oldProps, newProps) => {
  if (newProps) {
    for (let key in newProps) {
      //给元素添加属性，注意props的children（不需要加）和style（可能存在多个属性需要遍历添加）
      if (key === 'children') {
        continue;
      } else if (key === 'style') {
        let styleObj = newProps[key];
        for (let arr in styleObj) {
          dom.style[arr] = styleObj[arr];
        }
      } else {
        //其他属性
        dom[key] = newProps[key];
      }
    }
  }
  //如果oldProps存在，则进行新旧比较，将旧的属性在新属性中不存在的值删除
  if (oldProps) {
    for (let key in oldProps) {
      if (!newProps[key]) {
        dom[key] = null;
      }
    }
  }
};

const ReactDOM = {
  render,
};

export default ReactDOM;
```

## 🎯React.forwardRef源码

### React.forwardRef的基本使用

我们一般通过React.forwardRef来获取函数式组件的子组件内部的dom（因为直接使用ref不能获取函数式组件的dom）

可以看到forwardRef包裹的 `<Child/>`组件的type有两个属性，其中render是浏览器生成的，调用可以生成vnode

```
import { useRef } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

const Child = React.forwardRef((props, childRef) => {
  return (
    <div>
      <input type="text" ref={childRef} />
    </div>
  );
});
console.log(<Child />);
            
const Main = () => {
  const childRef = useRef(null);
  const childhandler = () => {
    console.log(childRef);
  };
  return (
    <div>
      <Child ref={childRef}></Child>
      <button onClick={childhandler}>getFocus</button>
    </div>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));

```

### React.forwardRef源码

> React.forwardRef

```
import { REACT_ELEMENT, REACT_FORWARDREF } from './constants';
🧲
function createElement(type, config, ...children) {
  //...
}
🧲
function forwardRef(render) {
  return {
    $$typeofs: REACT_FORWARDREF,
    render,
  };
}

const React = {
  createElement,
  forwardRef,
};

export default React;
```

> ReactDOM

```
import { REACT_TEXT } from './constants';

//初始化react元素
const render = (vdom, container) => {
//...
};
//vdom=>真实dom
const createDom = (vdom) => {
  let { type, props, content } = vdom;
  let dom; 
  //forwardRef判断
  if (type && type.$$typeof) {
    return mountForWardRef(vdom);
  }
  else if (type == REACT_TEXT) {
    dom = document.createTextNode(content);
  } else if (typeof type == 'function') {
    return mountFunctionCpn(vdom);
  } else {
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
    let children = props.children;
    if (children) {
      changeChildren(children, dom);
    }
  }
  return dom;
};

//处理forwardRef
const mountForWardRef = (vdom) => {
  let { type, props, ref } = vdom;
  let refVnode = type.render(props, ref); 
  return createDom(refVnode);
};

const ReactDOM = {
  render,
};

export default ReactDOM;

```

## 🎯React.createContext源码

### React.createContext源码

> **React**

```
function createContext() { //本质就是一个变量
   let context = {
      $$typeofs: REACT_CONTEXT,
      _currentValue: undefined
   }

   context.Provider = {
      $$typeofs: REACT_PROVIDER,
      _context: context
   }
   context.Consumer = {
      $$typeofs: REACT_CONTEXT,
      _context: context
   }
   return context
}

const React = {
   createContext,
}

export default React
```

> **ReactDOM**

```
🧲function crateDom(vdom) {

    if (typeof vdom == 'string' || typeof vdom == 'number') {
        vdom = {
            type: REACT_TEXT,
            content: vdom
        }
    }
    let { type, props, content, ref } = vdom
    let dom 
   //判断$$typeofs是REACT_PROVIDER和 REACT_CONTEXT
    if (type && type.$$typeofs == REACT_PROVIDER) {
        return mountProverComponent(vdom)
    } else if (type && type.$$typeofs == REACT_CONTEXT) {
        return mountContextComponent(vdom)
    } else if (type && type.$$typeofs == REACT_FORWARDREF) {
        return mountForWardRef(vdom)
    } else if (type == REACT_TEXT) { 
        dom = document.createTextNode(content)
    } else if (typeof type == 'function') { 
        if (type.isReactComponent) { 
            return mountClassComponent(vdom)
        }
        return mountFunctionComponent(vdom)
    } else { //元素
        dom = document.createElement(type) 
    }
    if (props) { 
        updatePropos(dom, {}, props) 
        //3 children
        let children = props.children
        if (children) {
            changeChildren(children, dom, props)
        }
    }
    vdom.dom = dom //保存真实dom
    if (ref) ref.current = dom
    return dom
}

🧲//处理provider组件
function mountProverComponent(vdom) {
    //  console.log(vdom) //{}
    let { type, props } = vdom //type => Provider{$$typeofs: Symbol(REACT_PROVIDER), _context: {…}}

    //获取数据赋值
    let context = type._context  //給context =>React.creatContext()
    context._currentValue = props.value//赋值 {color:red}
    //渲染 元素propsc.children
    let renderVdom = props.children
    // if(!renderVdom) return null
    //
    vdom.oldReaderVnode = renderVdom //后面用来更新
    return crateDom(renderVdom)

}
🧲//处理context组件
function mountContextComponent(vdom) {
    let { type, props } = vdom //type => Provider{$$typeofs: Symbol(REACT_PROVIDER), _context: {…}}
    //获取数据
    let context = type._context  //給context =>React.creatContext()
    //渲染 元素propsc.children
    let renderVdom = props.children(context._currentValue)
    //

    vdom.oldReaderVnode = renderVdom //后面用来更新
    // if(!renderVdom) return null
    return crateDom(renderVdom)
}
```

## 🎯react-router源码

### Hash和History路由模式的实现原理

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
