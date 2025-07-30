---
date: 2023-08-11
category:
  - 问题案例
---
大屏适配方案

<!-- more -->

# 大屏适配方案

1.先获取一下设计稿的宽高尺寸比 `baseProportion`，比如说设计的时候一般按照1920*1080

2.然后封装一个函数 `calcRate`，函数中先用window.innerWidth和window.innerHeight计算当前视窗的宽高比 `currentRate`。

然后比较设计稿和当前视窗的宽高比，如果当前视窗>设计稿，表示更宽，就以当前视窗的高/设计稿的高来做基本比，然后给大屏的根节点添加style：`transform =`scale(${scale.width}, ${scale.height}) translate(-50%, -50%)``来等比放大，并垂直居中（`translate()` 这个 [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 函数在水平和/或垂直方向上重新定位元素。）

如果当前视窗>设计稿，表示更高，就以当前视窗的宽/设计稿的宽来做基本比，然后给大屏的根节点添加style：`transform =`scale(${scale.width}, ${scale.height}) translate(-50%, -50%)``来等比放大，并垂直居中

3.再封装一个 `winDraw`函数，给windows增加 `onresize`事件，监听窗口大小变了就执行 `calcRate`函数（可以做个防抖）

```
import { ref, Ref } from 'vue'
interface PicType {
  appRef: Ref<HTMLElement>
  calcRate: () => void
  windowDraw: () => void
}
export default function useIndex(): PicType {
  // * 指向最外层容器
  const appRef = ref()
  // * 定时函数
  const timer = ref(0)
  // * 默认缩放值
  const scale = {
    width: '1920',
    height: '1080'
  }
  // * 设计稿尺寸（px）
  const baseWidth = 1920
  const baseHeight = 1080
  // * 需保持的比例（默认1.77778）
  const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
  const calcRate = () => {
    // 当前宽高比
    const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
    if (appRef.value) {
      if (currentRate > baseProportion) {
        // 表示更宽
        scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
        scale.height = (window.innerHeight / baseHeight).toFixed(5)
        console.log(scale)
        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      } else {
        // 表示更高
        scale.height = (window.innerWidth / baseProportion / baseHeight).toFixed(5)
        scale.width = (window.innerWidth / baseWidth).toFixed(5)
        console.log(scale)

        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      }
    }
  }

  const resize = () => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      calcRate()
    }, 200)
  }

  // 改变窗口大小重新绘制
  const windowDraw = () => {
    window.addEventListener('resize', resize)
  }

  return {
    appRef,
    calcRate,
    windowDraw
  }
}
```
