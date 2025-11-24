# 子应用接入指南

本指南详细介绍如何将Vue 3子应用接入到主应用中。

## 技术栈

- Vue 3 + TypeScript
- Vite
- Qiankun 微前端框架

## 接入步骤

### 1. 实现Qiankun生命周期函数

在子应用的 [main.ts](../../src/main.ts) 中实现Qiankun生命周期函数：

```typescript
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'

renderWithQiankun({
  mount(props) {
    // 挂载逻辑
  },
  bootstrap() {
    // 初始化逻辑
  },
  unmount() {
    // 卸载逻辑
  },
  update() {
    // 更新逻辑
  }
})
```

### 2. 实现微前端环境检测

在子应用的 [micro/index.ts](../../src/micro/index.ts) 中实现微前端环境检测：

```typescript
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

// 全局变量：是否在qiankun环境中运行
export const isQiankunEnv = qiankunWindow.__POWERED_BY_QIANKUN__;
```

### 3. 配置路由基础路径

在子应用的 [router/index.ts](../../src/router/index.ts) 中根据环境配置路由基础路径：

```typescript
import { baseUrl } from '@/micro';

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes
});
```

### 4. 在主应用中注册子应用

在主应用中注册子应用，需要在 [utils/index.ts](../../src/utils/index.ts) 中添加子应用配置：

```typescript
export const getSubApp = () => {
  return [
    {
      name: '子应用',
      entry: 'http://localhost:8081',
      container: '#micro-app-container',
      activeRule: '/sub-app',
      props: {
        routerBase: '/sub-app'
      }
    }
  ]
};
```

具体步骤：

1. 打开主应用的 [utils/index.ts](../../src/utils/index.ts) 文件
2. 在getSubApp函数中添加子应用配置
3. 配置子应用的名称、入口地址、容器ID和激活规则

### 5. 配置Vite

在子应用的vite.config.ts中添加qiankun插件：

```typescript
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    qiankun('sub-app', {
      useDevMode: true
    })
  ]
})
```

## 环境变量配置

子应用支持通过环境变量配置基础路径：

```
# .env.production
BASE_PATH=/sub-app/
```

## 独立运行支持

子应用支持独立运行和微前端环境运行两种模式，具体配置请参考[独立运行配置](/sub-app/standalone)文档。
