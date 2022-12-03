import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Vump",
  base: "/vump/",
  description: "对微信小程序原生能力做功能增强",
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/vitejs/vite" }],
    nav: [
      {
        text: "指引",
        link: "/guide/introduction",
      },
      {
        text: "API",
        activeMatch: `^/api/`,
        link: "/api/",
      },
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          {
            text: "简介",
            link: "/guide/introduction",
          },
          {
            text: "快速开始",
            link: "/guide/quick-start",
          },
        ],
      },
      {
        text: "基础",
        items: [
          {
            text: "响应式",
            link: "/essential/reactivity",
          },
          {
            text: "事件方法",
            link: "/essential/methods",
          },
          {
            text: "Props",
            link: "/essential/props",
          },
          {
            text: "事件处理",
            link: "/essential/events",
          },
          {
            text: "生命周期",
            link: "/essential/lifecycle",
          },
        ],
      },
      {
        text: "进阶处理",
        items: [
          {
            text: "依赖注入",
            link: "/advanced/provide",
          },
          {
            text: "插件",
            link: "/advanced/plugin",
          },
          {
            text: "TypeScript",
            link: "/advanced/typescript",
          },
          {
            text: "增强原理",
            link: "/advanced/runtime",
          },
        ],
      },
    ],
  },
  vite: {
    server: {
      host: true,
      fs: {
        allow: ["../.."]
      }
    }
  },
});
