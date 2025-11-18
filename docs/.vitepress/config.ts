import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Qiankun Vite 微前端项目文档',
  description: '基于 Vite 和 Qiankun 的微前端解决方案文档',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '主应用详解', link: '/main-app/' },
      { text: '子应用接入', link: '/sub-app/' },
      { text: '部署指南', link: '/deployment/' }
    ],
    
    sidebar: {
      '/main-app/': [
        {
          text: '主应用详解',
          items: [
            { text: '架构概述', link: '/main-app/architecture' },
            { text: '路由配置', link: '/main-app/routing' },
            { text: '生命周期管理', link: '/main-app/lifecycle' },
            { text: '应用间通信', link: '/main-app/communication' }
          ]
        }
      ],
      '/sub-app/': [
        {
          text: '子应用接入',
          items: [
            { text: '接入指南', link: '/sub-app/guide' },
            { text: '生命周期实现', link: '/sub-app/lifecycle' },
            { text: '独立运行配置', link: '/sub-app/standalone' }
          ]
        }
      ],
      '/deployment/': [
        {
          text: '部署指南',
          items: [
            { text: '部署概述', link: '/deployment/overview' },
            { text: 'Vercel 部署', link: '/deployment/vercel' },
            { text: '主子应用独立部署', link: '/deployment/independent' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})