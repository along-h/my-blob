---
date: 2023-07-12
category:
  - 问题案例
---
大文件上传方案

<!-- more -->

# 大文件上传

## 一、分片

分为以下几步：

* 1.前端接收BGM并进行 `切片`
* 2.将每份 `切片`都进行 `上传`
* 3.后端接收到所有 `切片`，创建一个 `文件夹`存储这些 `切片`
* 4.后端将此 `文件夹`里的所有切片合并为完整的BGM文件
* 5.删除 `文件夹`，因为 `切片`不是我们最终想要的，可 `删除`

### 1.1 前端实现切片

简单来说就是，咱们上传文件时，选中文件后，浏览器会把这个文件转成一个 `Blob对象`，而这个对象的原型上有一个 `slice`方法，这个方法是大文件能够切片的原理，可以利用这个方法来给大文件切片

```vue
<template>
  <div>
    <input type="file" @change="handleFileChange" /><el-button
      @click="handleUpload"
    >
      上传
    </el-button>
   
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: '',

  data() {
    return {
      fileObj: {
        file: null,
        chunkList: []
      }
    }
  },
  methods: {
    // 获取文件
    handleFileChange(e) {
      const [file] = e.target.files
      if (!file) return
      this.fileObj.file = file
    },
    handleUpload() {
      const fileObj = this.fileObj
      if (!fileObj.file) return
      // 创建切片
      const chunkList = this.createChunk(fileObj.file)
      // 切片处理
      this.fileObj.chunkList = chunkList.map(({ file }, index) => ({
        file,
        size: file.size,
        percent: 0,
        chunkName: `${fileObj.file.name}-${index}`,
        fileName: fileObj.file.name,
        index
      }))
      this.uploadChunks() // 执行上传切片的操作
    },
    // 创建切片
    createChunk(file, size = 20 * 1024) {
      const chunkList = []
      let cur = 0
      while (cur < file.size) {
        chunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return chunkList
    },
   }
}
</script>

<style scoped></style>
```

### 1.2 上传切片并展示进度条

接着上一步，我们获得了所有 `切片`chunkList数组，接下来要把这些切片保存起来，如下格式（包括切片的文件流，文件大小，文件上传百分比（初始为0），切片的文件名，和总的文件名，和角标

```js
 handleUpload() {
      const fileObj = this.fileObj
      if (!fileObj.file) return
      const chunkList = this.createChunk(fileObj.file)
      this.fileObj.chunkList = chunkList.map(({ file }, index) => ({
        file,
        size: file.size,
        percent: 0,
        chunkName: `${fileObj.file.name}-${index}`,
        fileName: fileObj.file.name,
        index
      }))
      this.uploadChunks() // 执行上传切片的操作
    },
```

1. 我们先封装一个请求方法 `axiosRequest`，return的是一个promise，在promise中进行数据请求
2. 再封装一个函数，将刚才的chunkList进行处理，得到 `[{formdata,index},...]`数组，再map循环调用接口，得到一个promise的数组，再用promise.all请求
3. 在每个请求中传入axios的回调函数 `onUploadProgress`，通过event事件的e.loaded / e.total*100用来保存每个切片的上传比
4. 设置一个计算属性，reduce将每个切片的size*percent相加/总的文件大小，就获得了总的上传比例

```js
  computed: {
    totalPercent() {
      const fileObj = this.fileObj
      if (fileObj.chunkList.length === 0) return 0
      const loaded = fileObj.chunkList
        .map(({ size, percent }) => size * percent)
        .reduce((pre, next) => pre + next)
      return parseInt((loaded / fileObj.file.size).toFixed(2))
    }
  },
 
 //我们先封装一个请求方法，使用的是axios：
    axiosRequest({
      url,
      method = 'post',
      data,
      headers = {},
      onUploadProgress = (e) => e // 进度回调
    }) {
      return new Promise((resolve, reject) => {
        axios[method](url, data, {
          headers,
          onUploadProgress // 传入监听进度回调
        })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
// 上传切片
async uploadChunks() {
      const requestList = this.fileObj.chunkList
        .map(({ file, fileName, index, chunkName }) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('fileName', fileName)
          formData.append('chunkName', chunkName)
          return { formData, index }
        })
        .map(({ formData, index }) =>
          this.axiosRequest({
            url: 'http://localhost:8000/upload/avatar',
            data: formData,
            headers:{'Content-Type': 'multipart/form-data'}
            onUploadProgress: this.createProgressHandler(
              this.fileObj.chunkList[index]
            ) // 传入监听上传进度回调
          })
        )
      await Promise.all(requestList) // 使用Promise.all进行请求
      this.mergeChunks()

    },
  createProgressHandler(item) {
      return (e) => {
        // 设置每一个切片的进度百分比
        item.percent = parseInt(String((e.loaded / e.total) * 100))
      }
    },
```

### 1.3 发送合并请求

等每个切片都上传完毕后，给后端发一个合并请求，叫后端合并这些切片，前端代码添加合并的方法：那之前那些存在后端的切片就没用了，不然会浪费服务器的内存，所以我们在确保合并成功后，可以将他们 `删除`

```js
mergeChunks(size = 5 * 1024 * 1024) {
  this.axiosRequest({
    url: 'http://localhost:3000/merge',
    headers: {
       'content-type': 'application/json'
    },
    data: JSON.stringify({
      size,
      fileName: this.fileObj.file.name
    })
  })
}
```

### 1.4 完整代码

```vue
<template>
  <div>
    <input type="file" @change="handleFileChange" /><el-button
      @click="handleUpload"
    >
      上传
    </el-button>
    <div style="width: 300px">
      总进度：
      <el-progress :percentage="totalPercent"></el-progress>
      切片进度：
      <div v-for="item in fileObj.chunkList" :key="item">
        <span>{{ item.chunkName }}：</span>
        <el-progress :percentage="item.percent"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: '',
  computed: {
    totalPercent() {
      const fileObj = this.fileObj
      if (fileObj.chunkList.length === 0) return 0
      const loaded = fileObj.chunkList
        .map(({ size, percent }) => size * percent)
        .reduce((pre, next) => pre + next)
      return parseInt((loaded / fileObj.file.size).toFixed(2))
    }
  },
  data() {
    return {
      fileObj: {
        file: null,
        chunkList: []
      }
    }
  },
  methods: {
    handleFileChange(e) {
      const [file] = e.target.files
      if (!file) return
      this.fileObj.file = file
    },
    handleUpload() {
      const fileObj = this.fileObj
      if (!fileObj.file) return
      const chunkList = this.createChunk(fileObj.file)
      this.fileObj.chunkList = chunkList.map(({ file }, index) => ({
        file,
        size: file.size,
        percent: 0,
        chunkName: `${fileObj.file.name}-${index}`,
        fileName: fileObj.file.name,
        index
      }))
      this.uploadChunks() // 执行上传切片的操作
    },

    createChunk(file, size = 20 * 1024) {
      const chunkList = []
      let cur = 0
      while (cur < file.size) {
        chunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return chunkList
    },
   
    async uploadChunks() {
      const requestList = this.fileObj.chunkList
        .map(({ file, fileName, index, chunkName }) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('fileName', fileName)
          formData.append('chunkName', chunkName)
          return { formData, index }
        })
        .map(({ formData, index }) =>
          this.axiosRequest({
            url: 'http://localhost:8000/upload/avatar',
            data: formData,
            headers:{'Content-Type': 'multipart/form-data'}
            onUploadProgress: this.createProgressHandler(
              this.fileObj.chunkList[index]
            ) // 传入监听上传进度回调
          })
        )
      await Promise.all(requestList) // 使用Promise.all进行请求
      this.mergeChunks()

    },
    createProgressHandler(item) {
      return (e) => {
        // 设置每一个切片的进度百分比
        item.percent = parseInt(String((e.loaded / e.total) * 100))
      }
    },

    mergeChunks(size = 5 * 1024 * 1024) {
      this.axiosRequest({
        url: 'http://localhost:3000/merge',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          size,
          fileName: this.fileObj.file.name
        })
      })
    }
  }
}
</script>

<style scoped></style>
```

## 二、秒传功能

所谓的 `秒传功能`，其实没那么高大上，通俗点说就是，当你上传一个文件时，后端会判断服务器上有无这个文件，有的话就不执行上传，并返回给你 `“上传成功”`，想要执行此功能，后端需要重新写一个接口 `/verify`，这个接口接收一个 `fileName`参数，然后判断服务器上有没有这个文件，有的话就返回 `true`，没有的话就返回 `false`，前端在 `上传文件`步骤也要做拦截：调用这个接口，传入文件名字，通过返回结果来决定是否需要进行上传。

```js
// 上传文件
    handleUpload() {
      const fileObj = this.fileObj
      if (!fileObj.file) return
      //改造handleUpload
      const { shouldUpload } = await this.verifyUpload(fileObj.file.name)
      if (!shouldUpload) {
        alert('秒传：上传成功')
        return
      }

      const chunkList = this.createChunk(fileObj.file)
      this.fileObj.chunkList = chunkList.map(({ file }, index) => ({
        file,
        size: file.size,
        percent: 0,
        chunkName: `${fileObj.file.name}-${index}`,
        fileName: fileObj.file.name,
        index
      }))
      this.uploadChunks() // 执行上传切片的操作
    },
   
    async verifyUpload(fileName) {
      const { data } = await this.axiosRequest({
        url: 'http://localhost:3000/verify',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({ fileName })
      })
      return data
    },
```

## 三、暂停续传

暂停续传其实很简单，比如一个文件被切成10片，当你上传成功5片后，突然暂停，那么下次点击续传时，只需要过滤掉之前已经上传成功的那5片就行，怎么实现呢？其实很简单，只需要点击续传时，请求/verity接口，返回切片文件夹里现在已成功上传的切片列表，然后前端过滤后再把还未上传的切片的继续上传就行了，后端的/verify接口需要做一些修改。

1. 前端实现暂停上传
   通过 `axios.CancelToken`的source取消请求

```js
  <el-button @click="pauseUpload"> 暂停 </el-button>
  
import axios from 'axios'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

 pauseUpload() {
 //点击中断上传
      source.cancel('中断上传!')
      source = CancelToken.source() // 重置source，确保能续传+
    },

 axiosRequest({
      url,
      method = 'post',
      data,
      headers = {},
      onUploadProgress = (e) => console.log(e) 
    }) {
      return new Promise((resolve, reject) => {
        axios[method](url, data, {
          headers,
          onUploadProgress,
          //带上cancelToken参数
          cancelToken: source.token
        })
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
```

2. 续传
   调用接口获取到已上传的分片列表，再从所有的列表中进行筛选，上传未上传的分片文件

```js
  <el-button @click="keepUpload"> 续传 </el-button>
 async keepUpload() {
  // 筛选出未上传的切片
  const { uploadedList } = await this.verifyUpload(this.fileObj.file.name)
  // 继续上传
    this.uploadChunks(uploadedList)
  },
```

3. 优化进度条
   续传 `中，由于那些没有上传的切片会`从零开始 `传，所以会导致`总进度条 `出现`倒退现象 `，所以我们要对`总进度条 `做一下优化，确保他不会`倒退 `，做法就是维护一个变量，这个变量只有在`总进度大于他 `时他才会`更新成总进度

```js
watch: {
    totalPercent(newVal) {
      if (newVal > this.tempPercent) this.tempPercent = newVal
    }
  },
```
