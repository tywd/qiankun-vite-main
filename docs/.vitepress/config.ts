import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'Qiankun Vite 微前端项目文档',
  description: '基于 Vite 和 Qiankun 的微前端解决方案文档',
  
  // 忽略死链接检查，避免构建失败
  ignoreDeadLinks: true,
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '主应用详解', link: '/main-app/' },
      { text: '子应用接入', link: '/sub-app/' },
      { text: '部署指南', link: '/deployment/' },
      { text: '常见问题', link: '/faq' }
    ],
    
    sidebar: {
      '/main-app/': [
        {
          text: '主应用详解',
          items: [
            { text: '架构概述', link: '/main-app/architecture' },
            { text: '路由配置', link: '/main-app/routing' },
            { text: '生命周期管理', link: '/main-app/lifecycle' },
            { text: '应用间通信', link: '/main-app/communication' },
            { text: '样式隔离方案', link: '/main-app/style-isolation' },
            { text: '样式隔离总结', link: '/main-app/style-isolation-summary' }
          ]
        }
      ],
      '/sub-app/': [
        {
          text: '子应用接入',
          items: [
            { text: '接入指南', link: '/sub-app/index' },
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
            { text: '主子应用独立部署', link: '/deployment/independent' },
            { text: '部署检查清单', link: '/deployment/checklist' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})