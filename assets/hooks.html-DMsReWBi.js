import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as i,a as d,e as s,f as l}from"./app-CaxZhZIt.js";const t={},a=d("p",null,"React Hooks源码介绍",-1),r=l(`<h1 id="🎯react-hooks源码" tabindex="-1"><a class="header-anchor" href="#🎯react-hooks源码" aria-hidden="true">#</a> 🎯React Hooks源码</h1><h2 id="usestate源码" tabindex="-1"><a class="header-anchor" href="#usestate源码" aria-hidden="true">#</a> useState源码</h2><h3 id="_1-usestate的基本实现" tabindex="-1"><a class="header-anchor" href="#_1-usestate的基本实现" aria-hidden="true">#</a> 1.useState的基本实现</h3><p>下面代码可以实现useState，单个状态的保存和更改。</p><p><strong>存在问题</strong>：当组件中有多个状态需要维护时，不能满足</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createRoot } from &#39;react-dom/client&#39;;

let state;//记录上次的状态
const useState = (data) =&gt; {
  state = state ?? data; //如果保存过则用上次的，否则使用新的

  const setState = (newData) =&gt; {
    state = newData;
    //每次调用完，重新刷新组件
    render();
  };

  return [state, setState];
};

const Main = () =&gt; {
  let [number, setNumber] = useState(0);
  return (
    &lt;div&gt;
      &lt;div&gt;{number}&lt;/div&gt;
      &lt;button onClick={()=&gt;setNumber(number+1)}&gt;change&lt;/button&gt;
    &lt;/div&gt;
  );
};

const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  root.render(&lt;Main /&gt;);
};
render();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-usestate的具体实现" tabindex="-1"><a class="header-anchor" href="#_2-usestate的具体实现" aria-hidden="true">#</a> 2.useState的具体实现</h3><p>我们将useState的状态管理到数组，将索引和状态关联起来</p><p>每次更新状态的时候，通过索引获取对应的状态，并进行更新</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createRoot } from &#39;react-dom/client&#39;;

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) =&gt; {
  //初始化默认的数据
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  //将当前的index保存，保证调用setState时拿到的是自己的索引（因为后面会++）
  let currentIndex = hookIndex;
  const setState = (newData) =&gt; {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const Main = () =&gt; {
  let [number1, setNumber1] = useState(0);
  let [number2, setNumber2] = useState(0);
  return (
    &lt;div&gt;
      &lt;div&gt;{number1}&lt;/div&gt;
      &lt;button onClick={() =&gt; setNumber1(number1 + 1)}&gt;change&lt;/button&gt;
      &lt;div&gt;{number2}&lt;/div&gt;
      &lt;button onClick={() =&gt; setNumber2(number2 + 1)}&gt;change&lt;/button&gt;
    &lt;/div&gt;
  );
};
const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  hookIndex = 0; //每次重新render时，将全局的hookIndex进行重制，确保每次都是从0开始，防止++一直递增
  root.render(&lt;Main /&gt;);
};
render();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="usememo和usecallback源码" tabindex="-1"><a class="header-anchor" href="#usememo和usecallback源码" aria-hidden="true">#</a> useMemo和useCallback源码</h2><h3 id="_1-usememo和usecallback使用" tabindex="-1"><a class="header-anchor" href="#_1-usememo和usecallback使用" aria-hidden="true">#</a> 1.useMemo和useCallback使用</h3><blockquote><p><strong>useMemo和useCallback都用来避免不必要的组件刷新的问题</strong></p></blockquote><p>如下代码</p><p>在父组件的input中输入数据，number更改，结果是父子组件都会刷新。父组件刷新很合理，但Child组件刷新明显不合理，因为它没有用到number。</p><p>刷新原因：父组件刷新，{data}对象会被重新创建，memo比较前后不一致</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { memo, useCallback, useMemo } from &#39;react&#39;;
import { createRoot } from &#39;react-dom/client&#39;;

const Child = ({ data, onButtonClick }) =&gt; {
  console.log(&#39;Child重新渲染&#39;);
  return (
    &lt;div&gt;
      {data.age}
      &lt;button onClick={onButtonClick}&gt;Child&lt;/button&gt;
    &lt;/div&gt;
  );
};
const FChild = memo(Child); //比较两个属性，前后如果一致则不重新渲染组件 shouldComponentUpdate

const Main = () =&gt; {
  let [number, setNumber] = useState(&#39;Alan&#39;);
  let [age, setAge] = useState(0);

  const data = { age };
  const addClick = () =&gt; {
    setAge(age + 1);
  };
  return (
    &lt;div&gt;
      &lt;div&gt;{number}&lt;/div&gt;
      &lt;input type=&quot;text&quot; value={number} onChange={(e) =&gt; setNumber(e.target.value)} /&gt;
      &lt;FChild data={data} onButtonClick={addClick} /&gt;
    &lt;/div&gt;
  );
};

const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  hookIndex = 0; 
  root.render(&lt;Main /&gt;);
};
render();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时就可以使用hooks——useMemo和useCallback，分别用来缓存结果和方法（Child组件必须使用memo）</p><p>发现input输入后Child组件不再刷新</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  const data = useMemo(() =&gt; ({ age }), [age]);
  const addClick = useCallback(() =&gt; {
    setAge(age + 1);
  }, [age]);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-usememo具体实现" tabindex="-1"><a class="header-anchor" href="#_2-usememo具体实现" aria-hidden="true">#</a> 2.useMemo具体实现</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { memo } from &#39;react&#39;;
import { createRoot } from &#39;react-dom/client&#39;;

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) =&gt; {
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  let currentIndex = hookIndex;
  const setState = (newData) =&gt; {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const useMemo = (objFn, dependencies) =&gt; {
  //已经缓存过对象
  if (hookStates[hookIndex]) {
    let [lastMemo, lastDependencies] = hookStates[hookIndex];
//此时我们需要比较一下，dependencied和lastDependencies有没有发生变化，如果没变化说明返回原来的值即可
//如果有变化，则产生一个新对象，再进行缓存
    let same = dependencies.every((item, index) =&gt; item === lastDependencies[index]);
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
    //hookStates[hookIndex]项为一个数组   [ {age},[age] ]
    hookStates[hookIndex++] = [newMemo, dependencies];
    return newMemo;
  }
};

const Child = ({ data, onButtonClick }) =&gt; {
  console.log(&#39;Child重新渲染&#39;);
  return (
    &lt;div&gt;
      {data.age}
      &lt;button onClick={onButtonClick}&gt;Child&lt;/button&gt;
    &lt;/div&gt;
  );
};
const FChild = memo(Child); 

const Main = () =&gt; {
  let [number, setNumber] = useState(&#39;Alan&#39;);
  let [age, setAge] = useState(0);

  const data = useMemo(() =&gt; ({ age }), [age]);
  const addClick = useCallback(() =&gt; {
    setAge(age + 1);
  }, [age]);
  return (
    &lt;div&gt;
      &lt;div&gt;{number}&lt;/div&gt;
      &lt;input type=&quot;text&quot; value={number} onChange={(e) =&gt; setNumber(e.target.value)} /&gt;
      &lt;FChild data={data} onButtonClick={addClick} /&gt;
    &lt;/div&gt;
  );
};

const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  hookIndex = 0; 
  root.render(&lt;Main /&gt;);
};
render();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-usecallback具体实现" tabindex="-1"><a class="header-anchor" href="#_3-usecallback具体实现" aria-hidden="true">#</a> 3.useCallBack具体实现</h3><p>useCallback和useMemo实现几乎一致</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const useCallback = (callback, dependencies) =&gt; {
  //已经缓存过对象
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDependencies] = hookStates[hookIndex];
    //此时我们需要比较一下，dependencied和lastDependencies有没有发生变化，如果没变化说明返回原来的值即可
    //如果有变化，则产生一个新对象，再进行缓存
    let same = dependencies.every((item, index) =&gt; item === lastDependencies[index]);
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
    //hookStates[hookIndex]项为一个数组   [ () =&gt; {setAge(age + 1);},[age] ]
    hookStates[hookIndex++] = [callback, dependencies];
    return callback;
  }
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="useeffect源码" tabindex="-1"><a class="header-anchor" href="#useeffect源码" aria-hidden="true">#</a> useEffect源码</h2><h3 id="_1-useeffect的作用" tabindex="-1"><a class="header-anchor" href="#_1-useeffect的作用" aria-hidden="true">#</a> 1.useEffect的作用</h3><blockquote><p>1.useEffect解决的问题是什么？ 在函数组件中的副作用：比如不能绑定时间，操作dom，定时器</p><p>2.代替了componentDidMount componentDidUpdate componentWillUpdate</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { memo } from &#39;react&#39;;
import { createRoot } from &#39;react-dom/client&#39;;

const Main = () =&gt; {
  let [name, setName] = useState(&#39;Alan&#39;);
  let [number, setNumber] = useState(0);

  useEffect(() =&gt; {
    let timer = setInterval(() =&gt; setNumber(number + 1), 1000);

    return () =&gt; {
      clearInterval(timer);
    };
  }, [number]);

  return (
    &lt;div&gt;
      &lt;div&gt;{name}&lt;/div&gt;
      &lt;span&gt;{number}&lt;/span&gt;
      &lt;input type=&quot;text&quot; value={number} onChange={(e) =&gt; setName(e.target.value)} /&gt;
      &lt;div&gt;
        &lt;button onClick={() =&gt; setNumber(number + 1)}&gt;+&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  hookIndex = 0;
  root.render(&lt;Main /&gt;);
};
render();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-useeffect的具体实现" tabindex="-1"><a class="header-anchor" href="#_2-useeffect的具体实现" aria-hidden="true">#</a> 2.useEffect的具体实现</h3><p>通过对前后依赖的对比条件判断，来决定是否执行此次effect</p><blockquote><p>useEffect****宏任务执行，因此这里使用 <code>setTimeout</code></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { memo } from &#39;react&#39;;
import { createRoot } from &#39;react-dom/client&#39;;

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) =&gt; {
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  let currentIndex = hookIndex;
  const setState = (newData) =&gt; {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const useEffect = (callback, dependencies?) =&gt; {
  //已经缓存过
  if (hookStates[hookIndex]) {
    let [lastDestory, lastDependencies] = hookStates[hookIndex];
    let same = false;
    //如果依赖存在,对比两次的dependencice每一项是否一致
    if (lastDependencies) {
      same = dependencies.every((item, index) =&gt; item === lastDependencies[index]);
    }
    //如果依赖一致，说明此次useEffect不需要进行调用，只进行index递增
    if (same) {
      hookIndex++;
    } else {
      //如果依赖不一致，则进行缓存
      lastDestory &amp;&amp; lastDestory(); //如果需要销毁，则进行销毁
      let arr = [, dependencies];
      //useEffect宏任务执行
      setTimeout(() =&gt; {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  } else {
    //没缓存过
    let arr = [, dependencies];
     //useEffect宏任务执行
    setTimeout(() =&gt; {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
};
const Main = () =&gt; {
  let [name, setName] = useState(&#39;Alan&#39;);
  let [number, setNumber] = useState(0);


  useEffect(() =&gt; {
    let timer = setInterval(() =&gt; setNumber(number + 1), 1000);

    return () =&gt; {
      clearInterval(timer);
    };
  }, [number]);

  return (
    &lt;div&gt;
      &lt;div&gt;{name}&lt;/div&gt;
      &lt;span&gt;{number}&lt;/span&gt;
      &lt;input type=&quot;text&quot; value={number} onChange={(e) =&gt; setName(e.target.value)} /&gt;
      &lt;div&gt;
        &lt;button onClick={() =&gt; setNumber(number + 1)}&gt;+&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  hookIndex = 0;
  root.render(&lt;Main /&gt;);
};
render();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="uselayouteffect源码" tabindex="-1"><a class="header-anchor" href="#uselayouteffect源码" aria-hidden="true">#</a> useLayoutEffect源码</h2><h3 id="_1-useeffect和uselayouteffect的区别及产生原因" tabindex="-1"><a class="header-anchor" href="#_1-useeffect和uselayouteffect的区别及产生原因" aria-hidden="true">#</a> 1.useEffect和useLayoutEffect的区别及产生原因</h3><blockquote><p>两者的区别如下图，useEffect在屏幕初次绘制完后再执行，useLayoutEffect在屏幕初次绘制前就执行</p></blockquote><p>产生这种渲染时机的原因是：</p><p>useEffect在源码中是使用宏任务进行（这里用setTimeout模拟），而useLayoutEffect是使用微任务进行（这里使用queueMicrotask模拟）</p><p>正常渲染，会先走整体的script宏任务，再清空微任务，再去看是否页面到达了渲染时机，如果到达了渲染时机会进行页面渲染，再去执行宏任务</p><h3 id="_2-uselayouteffect的具体实现" tabindex="-1"><a class="header-anchor" href="#_2-uselayouteffect的具体实现" aria-hidden="true">#</a> 2.useLayoutEffect的具体实现</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const useLayoutEffect = (callback, dependencies?) =&gt; {
  //已经缓存过
  if (hookStates[hookIndex]) {
    let [lastDestory, lastDependencies] = hookStates[hookIndex];
    let same = false;
    //如果依赖存在,对比两次的dependencice每一项是否一致
    if (lastDependencies) {
      same = dependencies.every((item, index) =&gt; item === lastDependencies[index]);
    }
    //如果依赖一致，说明此次useEffect不需要进行调用，只进行index递增
    if (same) {
      hookIndex++;
    } else {
      //如果依赖不一致，则进行缓存
      lastDestory &amp;&amp; lastDestory(); //如果需要销毁，则进行销毁
      let arr = [, dependencies];
      queueMicrotask(() =&gt; {
        arr[0] = callback();
      });
      hookStates[hookIndex++] = arr;
    }
  } else {
    //没缓存过
    let arr = [, dependencies];
    queueMicrotask(() =&gt; {
      arr[0] = callback();
    });
    hookStates[hookIndex++] = arr;
  }
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="useref源码" tabindex="-1"><a class="header-anchor" href="#useref源码" aria-hidden="true">#</a> useRef源码</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const useRef = (data?) =&gt; {
  hookStates[hookIndex] = hookStates[hookIndex] ?? { current: data };
  return hookStates[hookIndex++];
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="usereducer源码" tabindex="-1"><a class="header-anchor" href="#usereducer源码" aria-hidden="true">#</a> useReducer源码</h2><h3 id="_1-usereducer的具体实现" tabindex="-1"><a class="header-anchor" href="#_1-usereducer的具体实现" aria-hidden="true">#</a> 1.useReducer的具体实现</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { memo } from &#39;react&#39;;
import { createRoot } from &#39;react-dom/client&#39;;

let hookStates = []; //保存所有状态的数组
let hookIndex = 0; //默认从第一个开始保存

const useState = (data) =&gt; {
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  
  let currentIndex = hookIndex;
  const setState = (newData) =&gt; {
    hookStates[currentIndex] = newData;
    render();
  };
  return [hookStates[hookIndex++], setState];
};

const useReducer = (reducer, data) =&gt; {
  //初始化默认的数据
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  //将当前的index保存，保证调用setState时拿到的是自己的索引（因为后面会++）
  let currentIndex = hookIndex;
  //新建dispatch函数，接受action，通过reducer函数返回对应的执行函数
  const dispatch = (action) =&gt; {
    hookStates[currentIndex] = reducer(hookStates[currentIndex], action);
    render();
  };
  return [hookStates[hookIndex++], dispatch];
};
const reducer = (state, action) =&gt; {
  switch (action.type) {
    case &#39;ADD&#39;:
      return state + 1;
    default:
      return state;
  }
};
const Main = () =&gt; {
  const [number, numberDispatch] = useReducer(reducer, 1);

  return (
    &lt;div&gt;
      {number}
      &lt;button onClick={() =&gt; numberDispatch({ type: &#39;ADD&#39; })}&gt;+&lt;/button&gt;
    &lt;/div&gt;
  );
};
const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  hookIndex = 0;
  root.render(&lt;Main /&gt;);
};
render();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-usestate的改进" tabindex="-1"><a class="header-anchor" href="#_2-usestate的改进" aria-hidden="true">#</a> 2.useState的改进</h3><p>可以看到useReducer和useState十分相像，因此可以对useState和useReducer进行改进</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const useState = (data) =&gt; {
return useReducer(null,data)
};

const useReducer = (reducer, data) =&gt; {
  //初始化默认的数据
  hookStates[hookIndex] = hookStates[hookIndex] ?? data;
  //将当前的index保存，保证调用setState时拿到的是自己的索引（因为后面会++）
  let currentIndex = hookIndex;
  //新建dispatch函数，接受action，通过reducer函数返回对应的执行函数
  const dispatch = (action) =&gt; {
    hookStates[currentIndex] = render?reducer(hookStates[currentIndex], action):action
    render();
  };
  return [hookStates[hookIndex++], dispatch];
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="usecontext源码" tabindex="-1"><a class="header-anchor" href="#usecontext源码" aria-hidden="true">#</a> useContext源码</h2><p>父组件内部使用Provider时，会将提供的数据挂载到生成的Context上</p><p>因此useContext其实只是返回了Context._currentValue</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { memo, createContext } from &#39;react&#39;;
import { createRoot } from &#39;react-dom/client&#39;;

const useContext = (context) =&gt; {
  return context._currentValue;
};

//创建一个上下文组件
const AgeContext = createContext({
  age: 0,
  setAge: (data) =&gt; {},
});

const Child = () =&gt; {
  const { age, setAge } = useContext(AgeContext);
  return (
    &lt;div&gt;
      {age}
      &lt;button onClick={() =&gt; setAge(age + 1)}&gt;+&lt;/button&gt;
    &lt;/div&gt;
  );
};

const Main = () =&gt; {
  const [age, setAge] = useState(0);
  return (
    &lt;div&gt;
      &lt;AgeContext.Provider value={{ age, setAge }}&gt;
        &lt;Child&gt;&lt;/Child&gt;
      &lt;/AgeContext.Provider&gt;
    &lt;/div&gt;
  );
};
const root = createRoot(document.getElementById(&#39;root&#39;));
const render = () =&gt; {
  hookIndex = 0;
  root.render(&lt;Main /&gt;);
};
render();

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="useimperativehandle源码" tabindex="-1"><a class="header-anchor" href="#useimperativehandle源码" aria-hidden="true">#</a> useImperativeHandle源码</h2><h3 id="_1-useref不能直接获取函数组件实例" tabindex="-1"><a class="header-anchor" href="#_1-useref不能直接获取函数组件实例" aria-hidden="true">#</a> 1.useRef不能直接获取函数组件实例</h3><p>父组件想要获取子组件的DOM，在class组件中可以通过ref获取到组件的实例，在函数组件没有实例，因此通过直接useRef获取到到的null</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const Main = () =&gt; {
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-forwardref获取函数组件dom" tabindex="-1"><a class="header-anchor" href="#_2-forwardref获取函数组件dom" aria-hidden="true">#</a> 2.forwardRef获取函数组件DOM</h3><p>React提供了 <code>forwardRef</code>来使函数组件暴露自己的DOM，供父组件操作</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { forwardRef } from &#39;react&#39;;

const Child = forwardRef((props, childRef) =&gt; {
  return (
    &lt;div&gt;
      &lt;input type=&quot;text&quot; ref={childRef} /&gt;
    &lt;/div&gt;
  );
});

const Main = () =&gt; {
  const childRef = useRef(null);
  const childhandler = () =&gt; {
    console.log(childRef);
    // childRef.current.focus();
  };
  return (
    &lt;div&gt;
      &lt;Child ref={childRef}&gt;&lt;/Child&gt;
      &lt;button onClick={childhandler}&gt;getFocus&lt;/button&gt;
    &lt;/div&gt;
  );
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-useimperativehandle的使用" tabindex="-1"><a class="header-anchor" href="#_3-useimperativehandle的使用" aria-hidden="true">#</a> 3.useImperativeHandle的使用</h3><p>可以将子组件想要暴露的的方法或者DOM以对象的形式暴露出去</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const Child = forwardRef((props, ref) =&gt; {
  const inputRef = useRef();
  useImperativeHandle(ref, () =&gt; ({
    focus() {
      inputRef.current.focus();
    },
  }));
  return (
    &lt;div&gt;
      &lt;input type=&quot;text&quot; ref={inputRef} /&gt;
    &lt;/div&gt;
  );
});

const Main = () =&gt; {
  const childRef = useRef(null);

  const childhandler = () =&gt; {
    // console.log(childRef);
    childRef.current.focus();
  };
  return (
    &lt;div&gt;
      &lt;Child ref={childRef}&gt;&lt;/Child&gt;
      &lt;button onClick={childhandler}&gt;getFocus&lt;/button&gt;
    &lt;/div&gt;
  );
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-useimperativehandle的具体实现" tabindex="-1"><a class="header-anchor" href="#_4-useimperativehandle的具体实现" aria-hidden="true">#</a> 4.useImperativeHandle的具体实现</h3><p>其实就是把第二个参数的返回值赋值给父组件ref的current</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const useImperativeHandle = (ref, handler) =&gt; {
  ref.current = handler();
};
const Child = forwardRef((props, ref) =&gt; {
  const inputRef = useRef();
  useImperativeHandle(ref, () =&gt; ({
    focus() {
      inputRef.current.focus();
    },
  }));
  return (
    &lt;div&gt;
      &lt;input type=&quot;text&quot; ref={inputRef} /&gt;
    &lt;/div&gt;
  );
});

const Main = () =&gt; {
  const childRef = useRef(null);

  const childhandler = () =&gt; {
    // console.log(childRef);
    childRef.current.focus();
  };
  return (
    &lt;div&gt;
      &lt;Child ref={childRef}&gt;&lt;/Child&gt;
      &lt;button onClick={childhandler}&gt;getFocus&lt;/button&gt;
    &lt;/div&gt;
  );
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="🎯虚拟dom和reactdom-render源码" tabindex="-1"><a class="header-anchor" href="#🎯虚拟dom和reactdom-render源码" aria-hidden="true">#</a> 🎯虚拟DOM和ReactDOM.render源码</h1><h1 id="react的dom渲染过程" tabindex="-1"><a class="header-anchor" href="#react的dom渲染过程" aria-hidden="true">#</a> React的DOM渲染过程</h1><blockquote><p><strong>JSX经过babel编译成React.createElement方法，生成虚拟DOM—vnode，再经过render渲染成真实DOM</strong></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import React from &#39;./React&#39;;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>可以看到vnode的props中存储了JSX中的数据，当标签内的children只有一个时，以****字符串</strong>保存；当有多个时，以<strong>数组</strong>形式保存。children也是JSX时，则以<strong>对象</strong>形式保存</p><h1 id="react-createelement源码" tabindex="-1"><a class="header-anchor" href="#react-createelement源码" aria-hidden="true">#</a> React.createElement源码</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_ELEMENT } from &#39;./constants&#39;;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="reactdom-render源码" tabindex="-1"><a class="header-anchor" href="#reactdom-render源码" aria-hidden="true">#</a> ReactDOM.render源码</h1><p><strong>真实dom</strong></p><p><strong>处理props</strong></p><p><strong>处理children</strong></p><p><strong>函数式组件的vnode的type，会被浏览器处理成一个函数，调用即可生成函数式组件的虚拟DOM</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_TEXT } from &#39;./constants&#39;;

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="🎯react-forwardref源码" tabindex="-1"><a class="header-anchor" href="#🎯react-forwardref源码" aria-hidden="true">#</a> 🎯React.forwardRef源码</h1><h1 id="react-forwardref的基本使用" tabindex="-1"><a class="header-anchor" href="#react-forwardref的基本使用" aria-hidden="true">#</a> React.forwardRef的基本使用</h1><p><strong>我们一般通过React.forwardRef来获取函数式组件的子组件内部的dom（因为直接使用ref不能获取函数式组件的dom）</strong></p><p><strong>可以看到forwardRef包裹的</strong> <code>&lt;Child/&gt;</code><strong>组件的type有两个属性，其中render是浏览器生成的，调用可以生成vnode</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { useRef } from &#39;react&#39;;
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="react-forwardref源码" tabindex="-1"><a class="header-anchor" href="#react-forwardref源码" aria-hidden="true">#</a> React.forwardRef源码</h1><blockquote><p><strong>React.forwardRef</strong></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_ELEMENT, REACT_FORWARDREF } from &#39;./constants&#39;;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>ReactDOM</strong></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { REACT_TEXT } from &#39;./constants&#39;;

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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="🎯react-createcontext源码" tabindex="-1"><a class="header-anchor" href="#🎯react-createcontext源码" aria-hidden="true">#</a> 🎯React.createContext源码</h1><h1 id="react-createcontext源码" tabindex="-1"><a class="header-anchor" href="#react-createcontext源码" aria-hidden="true">#</a> React.createContext源码</h1><blockquote><p><strong>React</strong></p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function createContext() { //本质就是一个变量
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="🎯react-router源码" tabindex="-1"><a class="header-anchor" href="#🎯react-router源码" aria-hidden="true">#</a> 🎯react-router源码</h1><h1 id="hash和history路由模式的实现原理" tabindex="-1"><a class="header-anchor" href="#hash和history路由模式的实现原理" aria-hidden="true">#</a> Hash和History路由模式的实现原理</h1><blockquote><p><strong>Hash模式：利用hash实现路由切换</strong></p></blockquote><p><strong>路径前带</strong> <code>#</code>就是Hash模式，当 路由地址发生改变，就会触发hashchange，就可以得到当前的路径，就可以渲染对应地址的组件</p><p><strong>本质上是改变window.location的href属性；</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>   // 监听URL的改变
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>自带的popstate事件可以监听forward，back，go但是不能监听pushState，因为需要手动劫持</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>       //解放方法：函数劫持
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,108);function v(c,u){return i(),n("div",null,[a,s(" more "),r])}const b=e(t,[["render",v],["__file","hooks.html.vue"]]);export{b as default};
