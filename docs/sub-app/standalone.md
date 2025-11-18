# 子应用独立运行配置

子应用需要同时支持独立运行和作为微前端嵌入两种模式，这使得子应用可以独立开发和测试。

## 独立运行配置

### 1. 环境检测

在子应用中需要检测当前运行环境，以决定使用哪种挂载方式：

```
// micro/index.ts
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

// 全局变量：是否在qiankun环境中运行
export const isQiankunEnv = qiankunWindow.__POWERED_BY_QIANKUN__;
```

### 2. 挂载逻辑

在 [main.ts](/src/main.ts) 中实现兼容两种环境的挂载逻辑：

```typescript
function initApp(props: any = {}) {
  const { container } = props
  
  app = createApp(App)
  
  // 注册插件和组件
  app.use(router).use(pinia)
  
  // 全局属性
  app.config.globalProperties.$qiankun = props
  
  // 修复挂载逻辑：在微前端环境下直接使用container，独立运行时使用默认容器
  let containerElement
  if (container) {
    // 微前端环境：直接使用qiankun提供的container
    containerElement = container
    console.log('微前端模式 - 使用qiankun容器:', container)
  } else {
    // 独立运行：使用默认容器
    containerElement = document.querySelector('#app') || document.body
    console.log('独立运行模式 - 使用默认容器:', containerElement)
  }
  
  if (!containerElement) {
    console.error('找不到挂载容器！')
    return
  }
  
  console.log('系统管理应用挂载容器:', containerElement)
  app.mount(containerElement)
}

// 独立运行时
if (!isQiankunEnv) {
  initApp()
}

```


### 3. 路由配置

在 [router/index.ts](/src/router/index.ts) 中根据环境配置不同的基础路径：

```
import { createRouter, createWebHistory } from 'vue-router'
import { isQiankunEnv } from '@/micro'

const router = createRouter({
  history: createWebHistory(isQiankunEnv ? '/qiankun-vite-sub' : '/'),
  routes
})

export default router

```


## 独立运行开发

### 1. 启动命令

在子应用的 [package.json](/package.json) 中配置开发启动命令：

```
  "scripts": {
    "dev": "vite --port 8082 --host",
    "build": "vue-tsc && vite build",
    "preview": "vite preview --port 8082"
  }

```


### 2. 开发环境配置

在 [vite.config.ts](/vite.config.ts) 中配置开发服务器：

```
export default defineConfig({
  server: {
    port: 8082,
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
  // 其他配置...

```


## 独立运行测试

### 1. 单元测试

子应用可以独立进行单元测试，不需要依赖主应用：

```
// 示例测试文件
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  test('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello')
  })
})

```


### 2. 端到端测试

子应用可以独立进行端到端测试：

```
// cypress 测试示例
describe('子应用测试', () => {
  it('should display welcome message', () => {
    cy.visit('/')
    cy.contains('h1', 'Welcome')
  })
})

```


## 独立运行部署

### 1. 构建配置

在 [vite.config.ts](/vite.config.ts) 中配置构建选项：

```
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'element-vendor': ['element-plus', '@element-plus/icons-vue'],
        }
      }
    }
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'terser'
  }
})

```


### 2. 部署配置

子应用可以独立部署到任何静态服务器或 CDN 上。

## 独立运行最佳实践

### 1. 环境适配

确保子应用在不同环境中都能正常运行：

```
// 根据环境配置不同的API地址
const API_BASE_URL = isQiankunEnv 
  ? '/api'  // 微前端环境下使用主应用的代理
  : 'http://localhost:3000/api'  // 独立运行时使用完整地址
```


### 2. 样式隔离

在独立运行时确保样式不会影响其他应用：

```
// 使用命名空间避免样式冲突
.my-sub-app {
  // 子应用样式
}

```


### 3. 全局变量管理

避免在独立运行时污染全局作用域：

```
// 使用模块作用域变量而不是全局变量
const appState = {
  // 应用状态
}

// 而不是
window.appState = {
  // 避免这样做
}

```


### 4. 错误处理

在独立运行时提供友好的错误提示：

```
if (!isQiankunEnv) {
  // 独立运行时的错误处理
  window.addEventListener('error', (event) => {
    console.error('子应用错误:', event.error)
    // 显示用户友好的错误页面
  })
}

```


## 调试技巧

1. **环境标识**：在页面中显示当前运行环境，便于调试
2. **日志级别**：在不同环境中使用不同的日志级别
3. **开发工具**：使用浏览器开发者工具调试独立运行的应用
4. **网络监控**：监控网络请求，确保API调用正确
