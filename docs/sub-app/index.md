# 子应用接入指南

本指南将详细介绍如何将子应用接入到基于 Qiankun 的主应用中。

## 接入前提

1. 子应用需要是一个独立的 Vue 3 + Vite 项目
2. 子应用需要安装 `vite-plugin-qiankun` 插件
3. 子应用需要正确实现 Qiankun 生命周期函数

## 接入步骤

### 1. 安装依赖

在子应用项目中安装 `vite-plugin-qiankun` 插件：

```bash
pnpm add vite-plugin-qiankun
```

### 2. 配置 Vite

在子应用的 [vite.config.ts](/vite.config.ts) 中添加 Qiankun 插件：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { name } from './package.json'
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    qiankun(name, {
      useDevMode: true
    })
  ],
  // 其他配置...
})
```

### 3. 实现生命周期函数

在子应用的 [main.ts](/src/main.ts) 中实现 Qiankun 生命周期函数：

```typescript
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'

let app: VueApp<Element> | null = null

function initApp(props: any = {}) {
  const { container } = props
  
  app = createApp(App)
  
  // 注册插件和组件
  app.use(router).use(pinia)
  
  // 挂载应用
  const containerElement = container || document.querySelector('#app') || document.body
  app.mount(containerElement)
}

// 独立运行时
if (!isQiankunEnv) {
  initApp()
}

// qiankun生命周期
renderWithQiankun({
  mount(props) {
    console.log('子应用 mount', props)
    initApp(props)
  },
  bootstrap() {
    console.log('子应用 bootstrap')
  },
  unmount() {
    console.log('子应用 unmount')
    if (app) {
      app.unmount()
      app = null
    }
  },
  update() {
    console.log('子应用 update')
  }
})
```

### 4. 配置微前端环境检测

在子应用的 [micro/index.ts](/src/micro/index.ts) 中实现微前端环境检测：

```typescript
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

// 全局变量：是否在qiankun环境中运行
export const isQiankunEnv = qiankunWindow.__POWERED_BY_QIANKUN__;
```

### 5. 配置路由

在子应用的 [router/index.ts](/src/router/index.ts) 中根据环境配置路由基础路径：

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { isQiankunEnv } from '@/micro'

const router = createRouter({
  history: createWebHistory(isQiankunEnv ? '/qiankun-vite-sub' : '/'),
  routes
})

export default router
```

## 主应用配置

在主应用中注册子应用，需要在 [utils/index.ts](/src/utils/index.ts) 中添加子应用配置：

```typescript
export const getSubApp = () => {
    return [
        {
            name: '子应用名称',
            entry: '子应用入口地址', // 例如：http://localhost:8082 或 https://your-sub-app.vercel.app
            container: '#micro-app-container',
            activeRule: '/子应用激活路径', // 例如：/qiankun-vite-sub
            props: {
                routerBase: '/子应用激活路径',
                mainAppInfo: {
                    name: '主应用传递给子应用的信息'
                }
            }
        }
    ]
};
```

## 注意事项

1. **端口配置**：确保子应用在开发环境中的端口不冲突
2. **跨域问题**：在开发环境中注意处理跨域问题
3. **资源路径**：确保子应用的资源路径正确
4. **样式隔离**：注意主应用与子应用之间的样式隔离
5. **状态管理**：合理使用全局状态管理，确保主子应用状态同步