import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as n,a as s,e as d,f as r}from"./app-CaxZhZIt.js";const t={},a=s("p",null,"redux使用",-1),l=r(`<h1 id="redux基本使用" tabindex="-1"><a class="header-anchor" href="#redux基本使用" aria-hidden="true">#</a> redux基本使用</h1><h2 id="一、网页中使用redux" tabindex="-1"><a class="header-anchor" href="#一、网页中使用redux" aria-hidden="true">#</a> 一、网页中使用redux</h2><h6 id="_1、-引入redux" tabindex="-1"><a class="header-anchor" href="#_1、-引入redux" aria-hidden="true">#</a> 1、 引入redux</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;script src=&quot;https://unpkg.com/redux@4.2.0/dist/redux.js&quot;&gt;&lt;/script&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="_2、创建reducer整合函数" tabindex="-1"><a class="header-anchor" href="#_2、创建reducer整合函数" aria-hidden="true">#</a> 2、创建reducer整合函数</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function reducer(state = {count: 1}, action) {
  switch(aciton.type) {
    case &#39;ADD&#39;:
      returen {...state, count: state.count + 1}；
    case &#39;SUB&#39;: 
      return {...state, count: state.count - 1};
    case &#39;ADD_N&#39;:
      return {...state, count: state.count + action.payload}
    default: 
      return state
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>action是一个js对象，它里边会保存操作信息；</p><p>type表示操作的类型；</p><p>其他需要传递的参数也可以在action中设置</p><h6 id="_3、-通过reducer对象创建store" tabindex="-1"><a class="header-anchor" href="#_3、-通过reducer对象创建store" aria-hidden="true">#</a> 3、 通过reducer对象创建store</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>const store = Redux.createStore(reducer, 1);//1为初始值可以改
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="_4、-对store中的state进行订阅" tabindex="-1"><a class="header-anchor" href="#_4、-对store中的state进行订阅" aria-hidden="true">#</a> 4、 对store中的state进行订阅</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>store.subscribe(() =&gt; { console.log(store.getState()).count
})
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_5、通过dispatch派发state的操作指令" tabindex="-1"><a class="header-anchor" href="#_5、通过dispatch派发state的操作指令" aria-hidden="true">#</a> 5、通过dispatch派发state的操作指令</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>store.dispatcg({type: &#39;ADD_N&#39;,payload: 50});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>6、问题</p><p>1、state过于复杂时会非常难以维护；</p><p>--通过对redux分组进行解决，</p><p>2、state每次操作时，都得重新复制再去修改；</p><p>3、case后边常量难维护</p><p>（因此引入RTK--redux toolkit）</p><h2 id="二、rtk-redux-toolkit" tabindex="-1"><a class="header-anchor" href="#二、rtk-redux-toolkit" aria-hidden="true">#</a> 二、RTK（redux toolkit）</h2><h6 id="_1、安装redux和rtk" tabindex="-1"><a class="header-anchor" href="#_1、安装redux和rtk" aria-hidden="true">#</a> 1、安装redux和RTK</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install react-redux @reduxjs/toolkit -s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h6 id="_2、createslice封装reducer切片" tabindex="-1"><a class="header-anchor" href="#_2、createslice封装reducer切片" aria-hidden="true">#</a> 2、createSlice封装reducer切片</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createSlice } from &#39;@reduxjs/toolkit&#39;;
// createSlice 创建reducer切片
// 它需要一个配置对象作为参数，通过对象的不同属性来制定它的配置
const stuSlice = createSlice({
  name: &#39;stu&#39;, // 用来自动生成action中的type等
  initialState: {
    name: &#39;张三&#39;,
    age: 18,
    gender: &#39;男&#39;
  },//当前切片state的初始值
  reducers: {
    setName(state, action) {
      // 可以通过不同的方法来指定对state的不同操作
      // 两个参数： state 这个state是一个代理对象，可以直接修改，不需要再复制
      state.name = action.payload;
    },
    setAge(state, action) {
      state.age = action.payload;
    }
  },// 指定state的各种操作,直接在对象中添加相应方法
});

// 切片对象会自动的帮助我们生成action
console.log(stuSlice.actions)
// actions中存储的是slice自动生成action创建器（函数），调用函数后会自动创建action对象
// action对象结构{type: name/函数名, payload: 函数参数}
export const { setName, setAge } = stuSlice.actions;
//在用到地方调用actions改变state
export const { reducer: stuReducer } = stuSlice;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_3、configurestore创建store" tabindex="-1"><a class="header-anchor" href="#_3、configurestore创建store" aria-hidden="true">#</a> 3、configureStore创建store</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//使用RTK来构建store
import { configureStore } from &#39;@reduxjs/toolkit&#39;;
import { schoolReducer } from &#39;./schoolSlice&#39;;
import { stuReducer } from &#39;./stuSlice&#39;;


//创建store 用来创建store对象，需要一个配置对象作为参数
const store = configureStore({
  // reducer: stuSlice.reducer// 单个
  reducer: {
    // 多个
    // xxx:xxxSlice.reducer
    student: stuReducer,
    school: schoolReducer
  }
});
export default store
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_4、修改入口文件index-js" tabindex="-1"><a class="header-anchor" href="#_4、修改入口文件index-js" aria-hidden="true">#</a> <strong>4、修改入口文件index.js</strong></h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import React from &#39;react&#39;;
import ReactDOM from &#39;react-dom/client&#39;;
import App from &#39;./App&#39;;
//RTK相关
import { Provider } from &#39;react-redux&#39;;
import store from &#39;./store&#39;;

const root = ReactDOM.createRoot(document.getElementById(&#39;root&#39;));
root.render(
  &lt;Provider store={store}&gt;
    &lt;App /&gt;
  &lt;/Provider&gt;
);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_5、利用useselector与usedispatch加载和修改state" tabindex="-1"><a class="header-anchor" href="#_5、利用useselector与usedispatch加载和修改state" aria-hidden="true">#</a> 5、利用useSelector与useDispatch加载和修改state</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { useDispatch, useSelector } from &quot;react-redux&quot;;
import { setName as setSchoolName } from &quot;./store/schoolSlice&quot;;
import { setAge, setName } from &quot;./store/stuSlice&quot;;
function App() {
  // useSelector用来加载state数据
  const student = useSelector(state =&gt; state.student);
  const school = useSelector(state =&gt; state.school);
  // useDispatch获取派发器
  const dispatch = useDispatch();
  // 获取action的构建器
  const setNameHandler = () =&gt; {
    dispatch(setName(&#39;王五&#39;))
  }
  const setAgeHandler = () =&gt; {
    dispatch(setAge(21))
  }
  const setSchoolNameHandler = () =&gt; {
    dispatch(setSchoolName(&#39;中学&#39;))
  }
  return (
    &lt;div className=&quot;App&quot;&gt;
      &lt;p&gt;
        {student.name} --
        {student.age} --
        {student.gender}
      &lt;/p&gt;
      &lt;p&gt;
        {school.name}--
        {school.address}
      &lt;/p&gt;
      &lt;button onClick={setNameHandler}&gt;修改name&lt;/button&gt;
      &lt;button onClick={setAgeHandler}&gt;修改age&lt;/button&gt;
      &lt;button onClick={setSchoolNameHandler}&gt;修改学校name&lt;/button&gt;
    &lt;/div&gt;
  );
}

export default App;


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_6、持久化-redux-persist" tabindex="-1"><a class="header-anchor" href="#_6、持久化-redux-persist" aria-hidden="true">#</a> 6、持久化 redux-persist</h6><p>redux刷新后会重置与vuex一样，所以需要持久化</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm i redux-persist --save
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Store.js中</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
//使用RTK来构建store
import { combineReducers, configureStore } from &#39;@reduxjs/toolkit&#39;;

import { persistReducer, persistStore } from &#39;redux-persist&#39;;
import storage from &#39;redux-persist/lib/storage&#39;;

import { collapsedReducer } from &#39;./reducers/collapsedReducer&#39;;
import {xxxReducer} from &#39;./reducers/xxxReducer&#39;;

//对reducer进行包裹
const rootReducer = combineReducers({
  collapsed: collapsedReducer,
});
const persistConfig = {
  key: &#39;root&#39;,//存储在localStorage中的名字
  storage,
  // 如果不想将部分state持久化，可以将其放入黑名单(blacklist)中.黑名单是设置
  blacklist: [xxxReducer]
}
const myPersistReducer = persistReducer(persistConfig, rootReducer)
//创建store 用来创建store对象，需要一个配置对象作为参数
const store = configureStore({
  // reducer: stuSlice.reducer// 单个
  reducer: myPersistReducer,
  middleware: (getDefaultMiddleware) =&gt; {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
});
export const persistore = persistStore(store);
export default store
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根组件中</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { Provider } from &#39;react-redux&#39;;
import { PersistGate } from &#39;redux-persist/integration/react&#39;;
import IndexRouter from &quot;./router/IndexRouter&quot;;
import store, { persistore } from &#39;./store&#39;;
function App() {
  return (
    &lt;Provider store={store}&gt;
      &lt;PersistGate loading={null} persistor={persistore}&gt;
      &lt;IndexRouter /&gt;
        &lt;/PersistGate&gt;
    &lt;/Provider&gt;
  );
}

export default App;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、rtkq-rtk-query" tabindex="-1"><a class="header-anchor" href="#三、rtkq-rtk-query" aria-hidden="true">#</a> 三、RTKQ（RTK Query）</h2><p>优点：</p><p>可以帮我们处理以下几个问题：</p><p>1、根据不同加载状态显示不同组件；</p><p>2、减少对相同数据重复发送请求（一般是不怎么会变的数据。会有一个有效时间，在时间内请求的都是取缓存里的）</p><p>3、使用乐观更新，提升用户体验（数据未加载成功使采用旧数据或错误信息，成功就显示新数据）</p><p>4、在用户与UI交互时，管理缓存的生命周期（数据更新后使用新数据，未更新使用缓存）</p><p>引入RTK后无需再引入其他包，RTK默认已包含RTKQ（采用简单封装过的fetch请求方式）</p><p>不同点：RTKQ创建的是Api切片，RTK是slice切片</p><h6 id="_1、createapi-包含标签" tabindex="-1"><a class="header-anchor" href="#_1、createapi-包含标签" aria-hidden="true">#</a> 1、createApi(包含标签)</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { createApi, fetchBaseQuery } from &#39;@reduxjs/toolkit/dist/query/react&#39;;

// 创建Api对象
// createApi()用来创建RTKQ中的API对象
// RTKQ的所有功能都需要通过该对象来进行
// createApi()需要一个对象作为参数
const studentApi = createApi({
  reducerPath: &#39;studentApi&#39;,//Api的标识，不能和其他的Api或reducer重复
  baseQuery: fetchBaseQuery({
    baseUrl: &#39;http://localhost:1337/api/&#39;
  }),// baseQuery指定查询的基本信息，发送请求使用的工具
  tagTypes: [&#39;student&#39;, &#39;teacher&#39;],// 用来指定Api中的标签
  //fetchBaseQuery是RTKQ请求的简单封装
  endpoints(build) {
    // build 请求构建器，通过build设置请求相关信息
    return {
      // 获取所有学生
      getStudents: build.query({
        query() {
          // query 用来指定请求子路径
          return &#39;students&#39;;
        },
        // 转换返回的响应数据格式
        transformResponse(res) {
          return res.data
        },
        providesTags: [{ type: &#39;student&#39;, id: &#39;LIST&#39; }, &#39;teacher&#39;],// 当其中一个标签失效时，就重新请求数据
      }),// query -- 查询
      updateStudent: build.mutation(),// mutation -- 修改
      getStudentById: build.query({
        query(id) {
          return \`students/\${id}\`;
        },
        keepUnusedDataFor: 0,// 设置数据缓存时间，单位秒 默认60s
        providesTags: (id) =&gt; [{ type: &#39;student&#39;, id: id }]
      }),
      delStudent: build.mutation({
        query(id) {
          // 如果发送不是get请求，需要返回一个对象来设置请求的信息
          return {
            url: \`students/\${id}\`,
            method: &#39;delete&#39;
          }
        },
        // invalidatesTags: [&#39;student&#39;],// 使标签失效，让其他标记了的请求重新发送
        // invalidatesTags: (result, error, id) =&gt; [{ type: &#39;student&#39;, id: id }],// 只是让student标签下相对应id的失效
        invalidatesTags: [{ type: &#39;student&#39;, id: &#39;LIST&#39; }]
      })
    };
  },// endpoints用来指定Api的各种功能，是一个方法，需要一个对象作为返回值
});

// Api对象创建后，对象中会根据各种方法自动生成对应的钩子函数
// 通过这些钩子行数，可以向服务器发送请求
// 钩子函数的命名规则， getStudents --&gt; useGetStudentsQuery,  updateStudent --&gt; useUpdateStudentMutation
export const {
  useGetStudentsQuery,
  useUpdateStudentMutation,
  useGetStudentByIdQuery,
  useDelStudentMutation
} = studentApi

export default studentApi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_2、创建store" tabindex="-1"><a class="header-anchor" href="#_2、创建store" aria-hidden="true">#</a> 2、创建store</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { configureStore } from &quot;@reduxjs/toolkit&quot;;
import { setupListeners } from &quot;@reduxjs/toolkit/dist/query&quot;;
import studentApi from &quot;./studentApi&quot;;
const store = configureStore({
  reducer: {
    [studentApi.reducerPath]: studentApi.reducer
  },
  // getDefaultMiddleware 返回当前store所有的默认中间价
  middleware: getDefaultMiddleware =&gt; getDefaultMiddleware().concat(studentApi.middleware)
});

setupListeners(store.dispatch);
//用于组件中获取焦点或者网络重连时是否重新发送请求，不配置那边设置是没有作用的
export default store
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_3、项目入口文件index-js配置-跟rtk一样" tabindex="-1"><a class="header-anchor" href="#_3、项目入口文件index-js配置-跟rtk一样" aria-hidden="true">#</a> 3、项目入口文件index.js配置(跟RTK一样)</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { Provider } from &#39;react-redux&#39;;
import store from &#39;./RTKQ-store&#39;;

const root = ReactDOM.createRoot(document.getElementById(&#39;root&#39;));
root.render(
  &lt;Provider store={store}&gt;
    &lt;App /&gt;
  &lt;/Provider&gt;

);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="_4、组件中使用" tabindex="-1"><a class="header-anchor" href="#_4、组件中使用" aria-hidden="true">#</a> 4、组件中使用</h6><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import { useDelStudentMutation, useGetStudentByIdQuery, useGetStudentsQuery } from &#39;./RTKQ-store/studentApi&#39;;

  const { data: idData } = useGetStudentByIdQuery(stuId, {
    // 可以接受一个对象作为第二个参数，该对象对请求进行配置
    selectFromResult: res =&gt; {
      return res
    },// 返回结果格式
    pollingInterval: 0,// 设置轮询间隔，单位毫秒，为0则表示不轮询,每隔xxx毫秒发送一次请求
    skip: false,// 是否跳过当前请求，默认false，不跳过该请求
    refetchOnMountOrArgChange: false, // 设置是否每次都重新加载数据，可以设置数字表示有效期时间，单位秒，如2，表示2秒，true每次都重新加载
    refetchOnFocus: false, // 是否在重新获取焦点时重新加载数据，比如离开当前网页，又点击当前网页时，需要在store中提供支持，setupListener
    refetchOnReconnect: false,// 网络重连时
  });
  const { data, isSuccess, isLoading } = useGetStudentsQuery(); // 调用Api中的钩子查询数据

 // 删除钩子，useMutation返回一个数组
  // 数组中第一个为触发器，第二个是结果集
  const [delStudent, { isSuccess: delSuccess }] = useDelStudentMutation();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,56);function u(c,v){return n(),i("div",null,[a,d(" more "),l])}const b=e(t,[["render",u],["__file","redux.html.vue"]]);export{b as default};
