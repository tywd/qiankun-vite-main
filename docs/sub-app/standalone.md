# 子应用独立运行配置

子应用支持独立运行和微前端环境运行两种模式，这样可以方便开发和调试。

## 实现原理

通过环境检测判断当前运行环境，然后采用不同的挂载逻辑和路由配置。

## 兼容两种环境的挂载逻辑

在 [main.ts](../../src/main.ts) 中实现兼容两种环境的挂载逻辑：

```typescript
import { isQiankunEnv } from './micro'

function initApp(props: any = {}) {
  const { container } = props
  
  // 创建Vue应用实例
  app = createApp(App)
  
  // 处理容器元素
  let containerElement
  if (container) {
    // 微前端环境：使用主应用提供的容器
    containerElement = container
  } else {
    // 独立运行：使用默认容器
    containerElement = document.querySelector('#app') || document.body
  }
  
  // 挂载应用
  app.mount(containerElement)
}

// 独立运行时初始化应用
if (!isQiankunEnv) {
  initApp()
}

// Qiankun生命周期函数
renderWithQiankun({
  mount(props) {
    initApp(props)
  },
  bootstrap() {
    // 初始化逻辑
  },
  unmount() {
    if (app) {
      app.unmount()
      app = null
    }
  },
  update() {
    // 更新逻辑
  }
})
```

## 路由配置

在 [router/index.ts](../../src/router/index.ts) 中根据环境配置不同的基础路径：

```typescript
import { baseUrl } from '@/micro';

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes
});
```

其中baseUrl的实现：

```typescript
// micro/index.ts
export const isQiankunEnv = qiankunWindow.__POWERED_BY_QIANKUN__;

// 路由基础路径：在qiankun中时使用主应用配置的activeRule
export const baseUrl = isQiankunEnv ? '/sub-app' : '/';
```

## 环境变量配置

通过环境变量配置不同环境的基础路径：

```bash
# .env.development (开发环境)
BASE_PATH=/

# .env.production (生产环境)
BASE_PATH=/sub-app/
```

在vite.config.ts中使用环境变量：

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = env.BASE_PATH || '/';
  
  return {
    base: basePath,
    // 其他配置...
  }
})
```

## 启动命令

```bash
# 独立运行
npm run dev

# 在微前端环境中运行（需要先启动主应用）
npm run dev
```

## 最佳实践

1. **环境检测**：准确检测运行环境，采用不同的配置
2. **路径配置**：正确配置路由基础路径，确保两种环境都能正常访问
3. **容器处理**：合理处理容器元素，在不同环境中使用合适的挂载点
4. **状态管理**：在环境切换时正确管理应用状态
5. **调试支持**：提供完善的调试支持，方便在两种环境中进行开发和调试
