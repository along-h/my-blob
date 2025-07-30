import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as i,a as d,e as l,f as s}from"./app-CaxZhZIt.js";const r={},v=d("p",null,"React.dom相关源码",-1),a=s(`<h1 id="🎯虚拟dom和reactdom-render源码" tabindex="-1"><a class="header-anchor" href="#🎯虚拟dom和reactdom-render源码" aria-hidden="true">#</a> 🎯虚拟DOM和ReactDOM.render源码</h1><h2 id="react的dom渲染过程" tabindex="-1"><a class="header-anchor" href="#react的dom渲染过程" aria-hidden="true">#</a> React的DOM渲染过程</h2><blockquote><p>JSX经过babel编译成React.createElement方法，生成虚拟DOM—vnode，再经过render渲染成真实DOM</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import React from &#39;./React&#39;;
import ReactDOM from &#39;./react-dom&#39;;

let element = React.createElement(
  &#39;h1&#39;,
  {
    className: &#39;title&#39;,
    style: {
      color: &#39;green&#39;,
    },
  },
  React.createElement(&#39;span&#39;, null, 666),
);

const FunctionCpn = (props) =&gt; {
  return React.createElement(&#39;h1&#39;, { style: { color: &#39;blue&#39; } }, 123, props.name);
};

const element2 = &lt;FunctionCpn name=&quot;100&quot;&gt;&lt;/FunctionCpn&gt;;

console.log(element);

ReactDOM.render(element2, document.getElementById(&#39;root&#39;));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到vnode的props中存储了JSX中的数据，当标签内的children只有一个时，以****字符串保存；当有多个时，以数组形式保存。children也是JSX时，则以对象形式保存</p><h2 id="react-createelement源码" tabindex="-1"><a class="header-anchor" href="#react-createelement源码" aria-hidden="true">#</a> React.createElement源码</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_ELEMENT } from &#39;./constants&#39;;
import { toObjFn } from &#39;./utils&#39;;
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
  if (arguments.length &gt; 3) {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="reactdom-render源码" tabindex="-1"><a class="header-anchor" href="#reactdom-render源码" aria-hidden="true">#</a> ReactDOM.render源码</h2><p>真实dom</p><p>处理props</p><p>处理children</p><p>函数式组件的vnode的type，会被浏览器处理成一个函数，调用即可生成函数式组件的虚拟DOM</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_TEXT } from &#39;./constants&#39;;

🧲//初始化react元素
const render = (vdom, container) =&gt; {
  //1 vdom=&gt;真实dom
  let newDom = createDom(vdom);
  //2 真实dom放到对应节点
  container.appendChild(newDom);
};
🧲//vdom=&gt;真实dom
const createDom = (vdom) =&gt; {
  let { type, props, content } = vdom;
  let dom; //真实dom
  //forwardRef
  if (type &amp;&amp; type.$$typeof) {
    return mountForWardRef(vdom);
  }
  //1 判断type是文本（string/number）或者元素div
  else if (type == REACT_TEXT) {
    dom = document.createTextNode(content);
  } else if (typeof type == &#39;function&#39;) {
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
const mountFunctionCpn = (vdom) =&gt; {
  let { type, props } = vdom;
  let functionVdom = type(props);
  return createDom(functionVdom);
};
🧲//处理forwardRef
const mountForWardRef = (vdom) =&gt; {
  let { type, props, ref } = vdom;
  let refVnode = type.render(props, ref); //函数式组件
  return createDom(refVnode);
};
🧲//处理children
const changeChildren = (children, dom) =&gt; {
  //1.一个children ,对象格式
  if (typeof children === &#39;object&#39; &amp;&amp; children.type) {
    render(children, dom);
  } else if (Array.isArray(children)) {
    children.forEach((item) =&gt; render(item, dom));
  }
  //2.多个children ,数组格式
};

🧲//更新props
const updateProps = (dom, oldProps, newProps) =&gt; {
  if (newProps) {
    for (let key in newProps) {
      //给元素添加属性，注意props的children（不需要加）和style（可能存在多个属性需要遍历添加）
      if (key === &#39;children&#39;) {
        continue;
      } else if (key === &#39;style&#39;) {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="🎯react-forwardref源码" tabindex="-1"><a class="header-anchor" href="#🎯react-forwardref源码" aria-hidden="true">#</a> 🎯React.forwardRef源码</h2><h3 id="react-forwardref的基本使用" tabindex="-1"><a class="header-anchor" href="#react-forwardref的基本使用" aria-hidden="true">#</a> React.forwardRef的基本使用</h3><p>我们一般通过React.forwardRef来获取函数式组件的子组件内部的dom（因为直接使用ref不能获取函数式组件的dom）</p><p>可以看到forwardRef包裹的 <code>&lt;Child/&gt;</code>组件的type有两个属性，其中render是浏览器生成的，调用可以生成vnode</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { useRef } from &#39;react&#39;;
import React from &#39;react&#39;;
import ReactDOM from &#39;react-dom&#39;;

const Child = React.forwardRef((props, childRef) =&gt; {
  return (
    &lt;div&gt;
      &lt;input type=&quot;text&quot; ref={childRef} /&gt;
    &lt;/div&gt;
  );
});
console.log(&lt;Child /&gt;);
            
const Main = () =&gt; {
  const childRef = useRef(null);
  const childhandler = () =&gt; {
    console.log(childRef);
  };
  return (
    &lt;div&gt;
      &lt;Child ref={childRef}&gt;&lt;/Child&gt;
      &lt;button onClick={childhandler}&gt;getFocus&lt;/button&gt;
    &lt;/div&gt;
  );
};

ReactDOM.render(&lt;Main /&gt;, document.getElementById(&#39;root&#39;));

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="react-forwardref源码" tabindex="-1"><a class="header-anchor" href="#react-forwardref源码" aria-hidden="true">#</a> React.forwardRef源码</h3><blockquote><p>React.forwardRef</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_ELEMENT, REACT_FORWARDREF } from &#39;./constants&#39;;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>ReactDOM</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_TEXT } from &#39;./constants&#39;;

//初始化react元素
const render = (vdom, container) =&gt; {
//...
};
//vdom=&gt;真实dom
const createDom = (vdom) =&gt; {
  let { type, props, content } = vdom;
  let dom; 
  //forwardRef判断
  if (type &amp;&amp; type.$$typeof) {
    return mountForWardRef(vdom);
  }
  else if (type == REACT_TEXT) {
    dom = document.createTextNode(content);
  } else if (typeof type == &#39;function&#39;) {
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
const mountForWardRef = (vdom) =&gt; {
  let { type, props, ref } = vdom;
  let refVnode = type.render(props, ref); 
  return createDom(refVnode);
};

const ReactDOM = {
  render,
};

export default ReactDOM;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="🎯react-createcontext源码" tabindex="-1"><a class="header-anchor" href="#🎯react-createcontext源码" aria-hidden="true">#</a> 🎯React.createContext源码</h2><h3 id="react-createcontext源码" tabindex="-1"><a class="header-anchor" href="#react-createcontext源码" aria-hidden="true">#</a> React.createContext源码</h3><blockquote><p><strong>React</strong></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function createContext() { //本质就是一个变量
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>ReactDOM</strong></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🧲function crateDom(vdom) {

    if (typeof vdom == &#39;string&#39; || typeof vdom == &#39;number&#39;) {
        vdom = {
            type: REACT_TEXT,
            content: vdom
        }
    }
    let { type, props, content, ref } = vdom
    let dom 
   //判断$$typeofs是REACT_PROVIDER和 REACT_CONTEXT
    if (type &amp;&amp; type.$$typeofs == REACT_PROVIDER) {
        return mountProverComponent(vdom)
    } else if (type &amp;&amp; type.$$typeofs == REACT_CONTEXT) {
        return mountContextComponent(vdom)
    } else if (type &amp;&amp; type.$$typeofs == REACT_FORWARDREF) {
        return mountForWardRef(vdom)
    } else if (type == REACT_TEXT) { 
        dom = document.createTextNode(content)
    } else if (typeof type == &#39;function&#39;) { 
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
    let { type, props } = vdom //type =&gt; Provider{$$typeofs: Symbol(REACT_PROVIDER), _context: {…}}

    //获取数据赋值
    let context = type._context  //給context =&gt;React.creatContext()
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
    let { type, props } = vdom //type =&gt; Provider{$$typeofs: Symbol(REACT_PROVIDER), _context: {…}}
    //获取数据
    let context = type._context  //給context =&gt;React.creatContext()
    //渲染 元素propsc.children
    let renderVdom = props.children(context._currentValue)
    //

    vdom.oldReaderVnode = renderVdom //后面用来更新
    // if(!renderVdom) return null
    return crateDom(renderVdom)
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="🎯react-router源码" tabindex="-1"><a class="header-anchor" href="#🎯react-router源码" aria-hidden="true">#</a> 🎯react-router源码</h2><h3 id="hash和history路由模式的实现原理" tabindex="-1"><a class="header-anchor" href="#hash和history路由模式的实现原理" aria-hidden="true">#</a> Hash和History路由模式的实现原理</h3><blockquote><p><strong>Hash模式：利用hash实现路由切换</strong></p></blockquote><p>路径前带 <code>#</code>就是Hash模式，当 路由地址发生改变，就会触发hashchange，就可以得到当前的路径，就可以渲染对应地址的组件</p><p>本质上是改变window.location的href属性；</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>   // 监听URL的改变
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,42);function t(c,m){return i(),n("div",null,[v,l(" more "),a])}const b=e(r,[["render",t],["__file","dom.html.vue"]]);export{b as default};
