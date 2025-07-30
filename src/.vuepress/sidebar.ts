import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  '/': [
    {
      text: '首页',
      icon: 'shouye',
      link: '/'
    },
    // {
    //   text: "如何使用",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    // },
    {
      text: "文章笔记",
      icon: "book",
      link: "posts/",
      prefix: "posts/",
      children: 'structure',
    },
    "intro",
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://plugin-md-enhance.vuejs.press/zh/guide/content/revealjs/demo.html",
    // },
  ],
});
