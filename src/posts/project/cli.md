---
date: 2025-03-08
category:
  - project
---
个人定制化脚手架

<!-- more -->

# create-fe-cli

## 介绍

因为目前前端框架市面上有很多，再加上目前`react`、`vue`大部分提供模板，想开发一个可以通过选择去配`prettier`、`eslint`、`commitlint`等工具的脚手架，帮助开发者快速完成项目配置。

## 目前功能

- 支持`react`、`vue`两大主流框架
- 针对`vue`，因为`create-vue`已经提供了很多选项，`vue`采用`create-vue`搭建模板后，再选择安装相应的校验工具
- 针对`react`，定制了个人的模板，选择支持选择安装相应的校验工具，另可选择是否安装`redux`，后续将支持`mobx`

支持规范：

- React
  - React + TypeScript
  - Redux
- Vue
  - create-vue
- Css
  - tailwindcss
  - postcss
  - stylelint
- 代码格式化
  - Prettier
  - Eslint
- 提交规范
  - commitlint
  - husky

## 安装

```bash
npm install -g create-fe-cli
```

## 使用

```bash
create-fe-cli init
```

## 地址

- [github](https://github.com/along-h/create-fe-cli)
