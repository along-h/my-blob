---
date: 2023-08-30
category:
  - react
---
redux使用

<!-- more -->

# redux基本使用

## 一、网页中使用redux

###### 1、 引入redux

```
<script src="https://unpkg.com/redux@4.2.0/dist/redux.js"></script>
```

###### 2、创建reducer整合函数

```
function reducer(state = {count: 1}, action) {
  switch(aciton.type) {
    case 'ADD':
      returen {...state, count: state.count + 1}；
    case 'SUB': 
      return {...state, count: state.count - 1};
    case 'ADD_N':
      return {...state, count: state.count + action.payload}
    default: 
      return state
  }
}
```

action是一个js对象，它里边会保存操作信息；

type表示操作的类型；

其他需要传递的参数也可以在action中设置

###### 3、 通过reducer对象创建store

```
const store = Redux.createStore(reducer, 1);//1为初始值可以改
```

###### 4、 对store中的state进行订阅

```
store.subscribe(() => { console.log(store.getState()).count
})
```

###### 5、通过dispatch派发state的操作指令

```
store.dispatcg({type: 'ADD_N',payload: 50});
```

6、问题

1、state过于复杂时会非常难以维护；

--通过对redux分组进行解决，

2、state每次操作时，都得重新复制再去修改；

3、case后边常量难维护

（因此引入RTK--redux toolkit）

## 二、RTK（redux toolkit）

###### 1、安装redux和RTK

```
npm install react-redux @reduxjs/toolkit -s
```

###### 2、createSlice封装reducer切片

```
import { createSlice } from '@reduxjs/toolkit';
// createSlice 创建reducer切片
// 它需要一个配置对象作为参数，通过对象的不同属性来制定它的配置
const stuSlice = createSlice({
  name: 'stu', // 用来自动生成action中的type等
  initialState: {
    name: '张三',
    age: 18,
    gender: '男'
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
```

###### 3、configureStore创建store

```
//使用RTK来构建store
import { configureStore } from '@reduxjs/toolkit';
import { schoolReducer } from './schoolSlice';
import { stuReducer } from './stuSlice';


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
```

###### **4、修改入口文件index.js**

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//RTK相关
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

###### 5、利用useSelector与useDispatch加载和修改state

```
import { useDispatch, useSelector } from "react-redux";
import { setName as setSchoolName } from "./store/schoolSlice";
import { setAge, setName } from "./store/stuSlice";
function App() {
  // useSelector用来加载state数据
  const student = useSelector(state => state.student);
  const school = useSelector(state => state.school);
  // useDispatch获取派发器
  const dispatch = useDispatch();
  // 获取action的构建器
  const setNameHandler = () => {
    dispatch(setName('王五'))
  }
  const setAgeHandler = () => {
    dispatch(setAge(21))
  }
  const setSchoolNameHandler = () => {
    dispatch(setSchoolName('中学'))
  }
  return (
    <div className="App">
      <p>
        {student.name} --
        {student.age} --
        {student.gender}
      </p>
      <p>
        {school.name}--
        {school.address}
      </p>
      <button onClick={setNameHandler}>修改name</button>
      <button onClick={setAgeHandler}>修改age</button>
      <button onClick={setSchoolNameHandler}>修改学校name</button>
    </div>
  );
}

export default App;


```

###### 6、持久化 redux-persist

redux刷新后会重置与vuex一样，所以需要持久化

```
npm i redux-persist --save
```

Store.js中

```

//使用RTK来构建store
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { collapsedReducer } from './reducers/collapsedReducer';
import {xxxReducer} from './reducers/xxxReducer';

//对reducer进行包裹
const rootReducer = combineReducers({
  collapsed: collapsedReducer,
});
const persistConfig = {
  key: 'root',//存储在localStorage中的名字
  storage,
  // 如果不想将部分state持久化，可以将其放入黑名单(blacklist)中.黑名单是设置
  blacklist: [xxxReducer]
}
const myPersistReducer = persistReducer(persistConfig, rootReducer)
//创建store 用来创建store对象，需要一个配置对象作为参数
const store = configureStore({
  // reducer: stuSlice.reducer// 单个
  reducer: myPersistReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
});
export const persistore = persistStore(store);
export default store
```

根组件中

```
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import IndexRouter from "./router/IndexRouter";
import store, { persistore } from './store';
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistore}>
      <IndexRouter />
        </PersistGate>
    </Provider>
  );
}

export default App;

```

## 三、RTKQ（RTK Query）

优点：

可以帮我们处理以下几个问题：

1、根据不同加载状态显示不同组件；

2、减少对相同数据重复发送请求（一般是不怎么会变的数据。会有一个有效时间，在时间内请求的都是取缓存里的）

3、使用乐观更新，提升用户体验（数据未加载成功使采用旧数据或错误信息，成功就显示新数据）

4、在用户与UI交互时，管理缓存的生命周期（数据更新后使用新数据，未更新使用缓存）

引入RTK后无需再引入其他包，RTK默认已包含RTKQ（采用简单封装过的fetch请求方式）

不同点：RTKQ创建的是Api切片，RTK是slice切片

###### 1、createApi(包含标签)

```
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

// 创建Api对象
// createApi()用来创建RTKQ中的API对象
// RTKQ的所有功能都需要通过该对象来进行
// createApi()需要一个对象作为参数
const studentApi = createApi({
  reducerPath: 'studentApi',//Api的标识，不能和其他的Api或reducer重复
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:1337/api/'
  }),// baseQuery指定查询的基本信息，发送请求使用的工具
  tagTypes: ['student', 'teacher'],// 用来指定Api中的标签
  //fetchBaseQuery是RTKQ请求的简单封装
  endpoints(build) {
    // build 请求构建器，通过build设置请求相关信息
    return {
      // 获取所有学生
      getStudents: build.query({
        query() {
          // query 用来指定请求子路径
          return 'students';
        },
        // 转换返回的响应数据格式
        transformResponse(res) {
          return res.data
        },
        providesTags: [{ type: 'student', id: 'LIST' }, 'teacher'],// 当其中一个标签失效时，就重新请求数据
      }),// query -- 查询
      updateStudent: build.mutation(),// mutation -- 修改
      getStudentById: build.query({
        query(id) {
          return `students/${id}`;
        },
        keepUnusedDataFor: 0,// 设置数据缓存时间，单位秒 默认60s
        providesTags: (id) => [{ type: 'student', id: id }]
      }),
      delStudent: build.mutation({
        query(id) {
          // 如果发送不是get请求，需要返回一个对象来设置请求的信息
          return {
            url: `students/${id}`,
            method: 'delete'
          }
        },
        // invalidatesTags: ['student'],// 使标签失效，让其他标记了的请求重新发送
        // invalidatesTags: (result, error, id) => [{ type: 'student', id: id }],// 只是让student标签下相对应id的失效
        invalidatesTags: [{ type: 'student', id: 'LIST' }]
      })
    };
  },// endpoints用来指定Api的各种功能，是一个方法，需要一个对象作为返回值
});

// Api对象创建后，对象中会根据各种方法自动生成对应的钩子函数
// 通过这些钩子行数，可以向服务器发送请求
// 钩子函数的命名规则， getStudents --> useGetStudentsQuery,  updateStudent --> useUpdateStudentMutation
export const {
  useGetStudentsQuery,
  useUpdateStudentMutation,
  useGetStudentByIdQuery,
  useDelStudentMutation
} = studentApi

export default studentApi
```

###### 2、创建store

```
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import studentApi from "./studentApi";
const store = configureStore({
  reducer: {
    [studentApi.reducerPath]: studentApi.reducer
  },
  // getDefaultMiddleware 返回当前store所有的默认中间价
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(studentApi.middleware)
});

setupListeners(store.dispatch);
//用于组件中获取焦点或者网络重连时是否重新发送请求，不配置那边设置是没有作用的
export default store
```

###### 3、项目入口文件index.js配置(跟RTK一样)

```
import { Provider } from 'react-redux';
import store from './RTKQ-store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>

);
```

###### 4、组件中使用

```
import { useDelStudentMutation, useGetStudentByIdQuery, useGetStudentsQuery } from './RTKQ-store/studentApi';

  const { data: idData } = useGetStudentByIdQuery(stuId, {
    // 可以接受一个对象作为第二个参数，该对象对请求进行配置
    selectFromResult: res => {
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
```
