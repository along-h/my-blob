---
date: 2023-09-10
category:
  - react
tag:
  - 源码
---
React Hooks源码介绍

<!-- more -->

# 🎯React Hooks源码

## useState源码

### 1.useState的基本实现

下面代码可以实现useState，单个状态的保存和更改。

**存在问题**：当组件中有多个状态需要维护时，不能满足

```
import { createRoot } from 'react-dom/client';

let state;//记录上次的状态
const useState = (data) => {
  state = state ?? data; //如果保存过则用上次的，否则使用新的

  const setState = (newData) => {
    state = newData;
    //每次调用完，重新刷新组件
    render();
  };

  return [state, setState];
};

const Main = () => {
  let [number, setNumber] = useState(0);
  return (
    <div>
      <div>{number}</div>
      <button onClick={()=>setNumber(number+1)}>change</button>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
const render = () => {
  root.render(<Main />);
};
render();

```

### 2.useState的具体实现

我们将useState的状态管理到数组，将索引和状态关联起来

每次更新状态的时候，通过索引获取对应的状态，并进行更新

```
import { createRoot } from 'react-dom/client';

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) => {
  //初始化默认的数据
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  //将当前的index保存，保证调用setState时拿到的是自己的索引（因为后面会++）
  let currentIndex = hookIndex;
  const setState = (newData) => {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const Main = () => {
  let [number1, setNumber1] = useState(0);
  let [number2, setNumber2] = useState(0);
  return (
    <div>
      <div>{number1}</div>
      <button onClick={() => setNumber1(number1 + 1)}>change</button>
      <div>{number2}</div>
      <button onClick={() => setNumber2(number2 + 1)}>change</button>
    </div>
  );
};
const root = createRoot(document.getElementById('root'));
const render = () => {
  hookIndex = 0; //每次重新render时，将全局的hookIndex进行重制，确保每次都是从0开始，防止++一直递增
  root.render(<Main />);
};
render();

```

## useMemo和useCallback源码

### 1.useMemo和useCallback使用

> **useMemo和useCallback都用来避免不必要的组件刷新的问题**

如下代码

在父组件的input中输入数据，number更改，结果是父子组件都会刷新。父组件刷新很合理，但Child组件刷新明显不合理，因为它没有用到number。

刷新原因：父组件刷新，{data}对象会被重新创建，memo比较前后不一致

```
import { memo, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

const Child = ({ data, onButtonClick }) => {
  console.log('Child重新渲染');
  return (
    <div>
      {data.age}
      <button onClick={onButtonClick}>Child</button>
    </div>
  );
};
const FChild = memo(Child); //比较两个属性，前后如果一致则不重新渲染组件 shouldComponentUpdate

const Main = () => {
  let [number, setNumber] = useState('Alan');
  let [age, setAge] = useState(0);

  const data = { age };
  const addClick = () => {
    setAge(age + 1);
  };
  return (
    <div>
      <div>{number}</div>
      <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
      <FChild data={data} onButtonClick={addClick} />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
const render = () => {
  hookIndex = 0; 
  root.render(<Main />);
};
render();

```

此时就可以使用hooks——useMemo和useCallback，分别用来缓存结果和方法（Child组件必须使用memo）

发现input输入后Child组件不再刷新

```
  const data = useMemo(() => ({ age }), [age]);
  const addClick = useCallback(() => {
    setAge(age + 1);
  }, [age]);
```

### 2.useMemo具体实现

```
import { memo } from 'react';
import { createRoot } from 'react-dom/client';

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) => {
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  let currentIndex = hookIndex;
  const setState = (newData) => {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const useMemo = (objFn, dependencies) => {
  //已经缓存过对象
  if (hookStates[hookIndex]) {
    let [lastMemo, lastDependencies] = hookStates[hookIndex];
//此时我们需要比较一下，dependencied和lastDependencies有没有发生变化，如果没变化说明返回原来的值即可
//如果有变化，则产生一个新对象，再进行缓存
    let same = dependencies.every((item, index) => item === lastDependencies[index]);
    if (same) {
      hookIndex++;
      return lastMemo;
    } else {
      let newMemo = objFn();
      hookStates[hookIndex++] = [newMemo, dependencies];
      return newMemo;
    }
  } else {
    //没缓存过对象
    //获取最新的对象
    let newMemo = objFn();
    //hookStates[hookIndex]项为一个数组   [ {age},[age] ]
    hookStates[hookIndex++] = [newMemo, dependencies];
    return newMemo;
  }
};

const Child = ({ data, onButtonClick }) => {
  console.log('Child重新渲染');
  return (
    <div>
      {data.age}
      <button onClick={onButtonClick}>Child</button>
    </div>
  );
};
const FChild = memo(Child); 

const Main = () => {
  let [number, setNumber] = useState('Alan');
  let [age, setAge] = useState(0);

  const data = useMemo(() => ({ age }), [age]);
  const addClick = useCallback(() => {
    setAge(age + 1);
  }, [age]);
  return (
    <div>
      <div>{number}</div>
      <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
      <FChild data={data} onButtonClick={addClick} />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
const render = () => {
  hookIndex = 0; 
  root.render(<Main />);
};
render();

```

### 3.useCallBack具体实现

useCallback和useMemo实现几乎一致

```
const useCallback = (callback, dependencies) => {
  //已经缓存过对象
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDependencies] = hookStates[hookIndex];
    //此时我们需要比较一下，dependencied和lastDependencies有没有发生变化，如果没变化说明返回原来的值即可
    //如果有变化，则产生一个新对象，再进行缓存
    let same = dependencies.every((item, index) => item === lastDependencies[index]);
    if (same) {
      hookIndex++;
      return lastCallback;
    } else {
      hookStates[hookIndex++] = [callback, dependencies];
      return callback;
    }
  } else {
    //没缓存过对象
    //获取最新的对象
    //hookStates[hookIndex]项为一个数组   [ () => {setAge(age + 1);},[age] ]
    hookStates[hookIndex++] = [callback, dependencies];
    return callback;
  }
};
```

## useEffect源码

### 1.useEffect的作用

> 1.useEffect解决的问题是什么？ 在函数组件中的副作用：比如不能绑定时间，操作dom，定时器
>
> 2.代替了componentDidMount componentDidUpdate componentWillUpdate

```
import { memo } from 'react';
import { createRoot } from 'react-dom/client';

const Main = () => {
  let [name, setName] = useState('Alan');
  let [number, setNumber] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => setNumber(number + 1), 1000);

    return () => {
      clearInterval(timer);
    };
  }, [number]);

  return (
    <div>
      <div>{name}</div>
      <span>{number}</span>
      <input type="text" value={number} onChange={(e) => setName(e.target.value)} />
      <div>
        <button onClick={() => setNumber(number + 1)}>+</button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
const render = () => {
  hookIndex = 0;
  root.render(<Main />);
};
render();

```

### 2.useEffect的具体实现

通过对前后依赖的对比条件判断，来决定是否执行此次effect

> useEffect****宏任务执行，因此这里使用 `setTimeout`

```
import { memo } from 'react';
import { createRoot } from 'react-dom/client';

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) => {
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  let currentIndex = hookIndex;
  const setState = (newData) => {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const useEffect = (callback, dependencies?) => {
  //已经缓存过
  if (hookStates[hookIndex]) {
    let [lastDestory, lastDependencies] = hookStates[hookIndex];
    let same = false;
    //如果依赖存在,对比两次的dependencice每一项是否一致
    if (lastDependencies) {
      same = dependencies.every((item, index) => item === lastDependencies[index]);
    }
    //如果依赖一致，说明此次useEffect不需要进行调用，只进行index递增
    if (same) {
      hookIndex++;
    } else {
      //如果依赖不一致，则进行缓存
      lastDestory && lastDestory(); //如果需要销毁，则进行销毁
      let arr = [, dependencies];
      //useEffect宏任务执行
      setTimeout(() => {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  } else {
    //没缓存过
    let arr = [, dependencies];
     //useEffect宏任务执行
    setTimeout(() => {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
};
const Main = () => {
  let [name, setName] = useState('Alan');
  let [number, setNumber] = useState(0);


  useEffect(() => {
    let timer = setInterval(() => setNumber(number + 1), 1000);

    return () => {
      clearInterval(timer);
    };
  }, [number]);

  return (
    <div>
      <div>{name}</div>
      <span>{number}</span>
      <input type="text" value={number} onChange={(e) => setName(e.target.value)} />
      <div>
        <button onClick={() => setNumber(number + 1)}>+</button>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
const render = () => {
  hookIndex = 0;
  root.render(<Main />);
};
render();
```

## useLayoutEffect源码

### 1.useEffect和useLayoutEffect的区别及产生原因

> 两者的区别如下图，useEffect在屏幕初次绘制完后再执行，useLayoutEffect在屏幕初次绘制前就执行

产生这种渲染时机的原因是：

useEffect在源码中是使用宏任务进行（这里用setTimeout模拟），而useLayoutEffect是使用微任务进行（这里使用queueMicrotask模拟）

正常渲染，会先走整体的script宏任务，再清空微任务，再去看是否页面到达了渲染时机，如果到达了渲染时机会进行页面渲染，再去执行宏任务

### 2.useLayoutEffect的具体实现

```
const useLayoutEffect = (callback, dependencies?) => {
  //已经缓存过
  if (hookStates[hookIndex]) {
    let [lastDestory, lastDependencies] = hookStates[hookIndex];
    let same = false;
    //如果依赖存在,对比两次的dependencice每一项是否一致
    if (lastDependencies) {
      same = dependencies.every((item, index) => item === lastDependencies[index]);
    }
    //如果依赖一致，说明此次useEffect不需要进行调用，只进行index递增
    if (same) {
      hookIndex++;
    } else {
      //如果依赖不一致，则进行缓存
      lastDestory && lastDestory(); //如果需要销毁，则进行销毁
      let arr = [, dependencies];
      queueMicrotask(() => {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  } else {
    //没缓存过
    let arr = [, dependencies];
    queueMicrotask(() => {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
};
```

## useRef源码

```
const useRef = (data?) => {
  hookStates[hookIndex] = hookStates[hookIndex] ?? { current: data };
  return hookStates[hookIndex++];
};
```

## useReducer源码

### 1.useReducer的具体实现

```
import { memo } from 'react';
import { createRoot } from 'react-dom/client';

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) => {
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  
  let currentIndex = hookIndex;
  const setState = (newData) => {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const useReducer = (reducer, data) => {
  //初始化默认的数据
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  //将当前的index保存，保证调用setState时拿到的是自己的索引（因为后面会++）
  let currentIndex = hookIndex;
  //新建dispatch函数，接受action，通过reducer函数返回对应的执行函数
  const dispatch = (action) => {
    hookStates[currentIndex] = reducer(hookStates[currentIndex], action);
    render();
  };
  return [hookStates[hookIndex++], dispatch];
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return state + 1;
    default:
      return state;
  }
};
const Main = () => {
  const [number, numberDispatch] = useReducer(reducer, 1);

  return (
    <div>
      {number}
      <button onClick={() => numberDispatch({ type: 'ADD' })}>+</button>
    </div>
  );
};
const root = createRoot(document.getElementById('root'));
const render = () => {
  hookIndex = 0;
  root.render(<Main />);
};
render();

```

### 2.useState的改进

可以看到useReducer和useState十分相像，因此可以对useState和useReducer进行改进

```
const useState = (data) => {
return useReducer(null,data)
};

const useReducer = (reducer, data) => {
  //初始化默认的数据
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  //将当前的index保存，保证调用setState时拿到的是自己的索引（因为后面会++）
  let currentIndex = hookIndex;
  //新建dispatch函数，接受action，通过reducer函数返回对应的执行函数
  const dispatch = (action) => {
    hookStates[currentIndex] = render?reducer(hookStates[currentIndex], action):action
    render();
  };
  return [hookStates[hookIndex++], dispatch];
};
```

## useContext源码

父组件内部使用Provider时，会将提供的数据挂载到生成的Context上

因此useContext其实只是返回了Context._currentValue

```
import { memo, createContext } from 'react';
import { createRoot } from 'react-dom/client';

const useContext = (context) => {
  return context._currentValue;
};

//创建一个上下文组件
const AgeContext = createContext({
  age: 0,
  setAge: (data) => {},
});

const Child = () => {
  const { age, setAge } = useContext(AgeContext);
  return (
    <div>
      {age}
      <button onClick={() => setAge(age + 1)}>+</button>
    </div>
  );
};

const Main = () => {
  const [age, setAge] = useState(0);
  return (
    <div>
      <AgeContext.Provider value={{ age, setAge }}>
        <Child></Child>
      </AgeContext.Provider>
    </div>
  );
};
const root = createRoot(document.getElementById('root'));
const render = () => {
  hookIndex = 0;
  root.render(<Main />);
};
render();

```

## useImperativeHandle源码

### 1.useRef不能直接获取函数组件实例

父组件想要获取子组件的DOM，在class组件中可以通过ref获取到组件的实例，在函数组件没有实例，因此通过直接useRef获取到到的null

```
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
```

### 2.forwardRef获取函数组件DOM

React提供了 `forwardRef`来使函数组件暴露自己的DOM，供父组件操作

```
import { forwardRef } from 'react';

const Child = forwardRef((props, childRef) => {
  return (
    <div>
      <input type="text" ref={childRef} />
    </div>
  );
});

const Main = () => {
  const childRef = useRef(null);
  const childhandler = () => {
    console.log(childRef);
    // childRef.current.focus();
  };
  return (
    <div>
      <Child ref={childRef}></Child>
      <button onClick={childhandler}>getFocus</button>
    </div>
  );
};
```

### 3.useImperativeHandle的使用

可以将子组件想要暴露的的方法或者DOM以对象的形式暴露出去

```
const Child = forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));
  return (
    <div>
      <input type="text" ref={inputRef} />
    </div>
  );
});

const Main = () => {
  const childRef = useRef(null);

  const childhandler = () => {
    // console.log(childRef);
    childRef.current.focus();
  };
  return (
    <div>
      <Child ref={childRef}></Child>
      <button onClick={childhandler}>getFocus</button>
    </div>
  );
};
```

### 4.useImperativeHandle的具体实现

其实就是把第二个参数的返回值赋值给父组件ref的current

```
const useImperativeHandle = (ref, handler) => {
  ref.current = handler();
};
const Child = forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));
  return (
    <div>
      <input type="text" ref={inputRef} />
    </div>
  );
});

const Main = () => {
  const childRef = useRef(null);

  const childhandler = () => {
    // console.log(childRef);
    childRef.current.focus();
  };
  return (
    <div>
      <Child ref={childRef}></Child>
      <button onClick={childhandler}>getFocus</button>
    </div>
  );
};
```

# 🎯虚拟DOM和ReactDOM.render源码

# React的DOM渲染过程

> **JSX经过babel编译成React.createElement方法，生成虚拟DOM—vnode，再经过render渲染成真实DOM**

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

**可以看到vnode的props中存储了JSX中的数据，当标签内的children只有一个时，以****字符串**保存；当有多个时，以**数组**形式保存。children也是JSX时，则以**对象**形式保存

# React.createElement源码

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

# ReactDOM.render源码

**真实dom**

**处理props**

**处理children**

**函数式组件的vnode的type，会被浏览器处理成一个函数，调用即可生成函数式组件的虚拟DOM**

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

# 🎯React.forwardRef源码

# React.forwardRef的基本使用

**我们一般通过React.forwardRef来获取函数式组件的子组件内部的dom（因为直接使用ref不能获取函数式组件的dom）**

**可以看到forwardRef包裹的** `<Child/>`**组件的type有两个属性，其中render是浏览器生成的，调用可以生成vnode**

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

# React.forwardRef源码

> **React.forwardRef**

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

> **ReactDOM**

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

# 🎯React.createContext源码

# React.createContext源码

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

# 🎯react-router源码

# Hash和History路由模式的实现原理

> **Hash模式：利用hash实现路由切换**

**路径前带** `#`就是Hash模式，当 路由地址发生改变，就会触发hashchange，就可以得到当前的路径，就可以渲染对应地址的组件

**本质上是改变window.location的href属性；**

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

**自带的popstate事件可以监听forward，back，go但是不能监听pushState，因为需要手动劫持**

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
