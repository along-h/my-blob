---
date: 2024-09-06
category:
  - 打包优化
---
记录某次打包优化过程

<!-- more -->
# 项目打包优化

1、警告：由于使用了 babel.config.js 中的 useBuiltIns但是没有指定版本会默认使用corejs@2，而packages中却安装了corejs@3，导致版本冲突，明确指定使用@3版本。

2、梳理依赖

发现存在着无作用的插件image-webapck-loader，与compression-webpack-plugin（服务器未开启gzip）

项目统一经过公司的bamboo CI/CD 进行打包，将package-lock.json 中被废弃的淘宝源改为公司私服，并上传私服中没有的包，并在流水线中设置公司私服nexus镜像

3、开启多线程：parallel

为 Babel 或 TypeScript 使用 `thread-loader`。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建

3、cache-loader配置

因为是CI/CD，每次CI/CD都是重新去拉代码进行打包，所以缓存无效，删除cache-loader配置

前后时间对比 9:00 -> 7:30 减少约17%

```
