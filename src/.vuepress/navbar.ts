import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: '首页',
    icon: 'shouye',
    link: '/'
  },
  // "/demo/",
  {
    text: "分类",
    icon: "fenlei",
    prefix: "/posts/",
    children: [
      {
        text: "vue",
        icon: "Vue",
        link: "vue/",
      },
      {
        text: "个人收藏",
        icon: "shoucangjia",
        link: "personal/",
      },
      {
        text: "浏览器",
        icon: "liulanqi",
        link: "browser/"
      },
      {
        text: "CSS",
        icon: "c",
        link: "css/"
      },
      {
        text: "React",
        icon: "React",
        link: "react/"
      },
      {
        text: "工程化",
        icon: "gongcheng-",
        link: "project/"
      },
      {
        text: "问题案例方案",
        icon: "question",
        link: "question/"
      }
    ],
  },
  {
    text: "友链",
    icon: "youlian",
    link: "/friends.md",
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
