# 子应用生命周期实现

子应用的生命周期管理是微前端架构中的关键部分，需要正确实现 Qiankun 框架要求的生命周期函数。

## 生命周期函数

Qiankun 框架要求子应用实现以下四个生命周期函数：

### 1. bootstrap

`bootstrap` 函数在子应用初始化时调用，只会在子应用生命周期中调用一次：

```typescript
bootstrap() {
  console.log('子应用 bootstrap')
  // 在这里可以做一些初始化工作，如设置全局变量等
}
```

### 2. mount

`mount` 函数在子应用每次挂载时调用：

```typescript
mount(props) {
  console.log('子应用 mount', props)
  // 初始化应用实例
  initApp(props)
}
```

### 3. unmount

`unmount` 函数在子应用每次卸载时调用：

```typescript
unmount() {
  console.log('子应用 unmount')
  // 清理资源，销毁应用实例
  if (app) {
    app.unmount()
    app = null
  }
}
```

### 4. update

`update` 函数在子应用更新时调用（可选）：

```typescript
update() {
  console.log('子应用 update')
  // 更新应用状态
}
```

## 完整实现示例

在子应用的 [main.ts](/src/main.ts) 中完整实现生命周期函数：

```typescript
import { createApp } from 'vue'
import type { App as VueApp } from 'vue'
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import router from './router'
import { createPinia } from 'pinia';
import App from './App.vue'
import { isQiankunEnv } from './micro'

let app: VueApp<Element> | null = null

function initApp(props: any = {}) {
  const { container } = props
  
  app = createApp(App)
  
  // 注册插件
  app.use(router).use(createPinia())
  
  // 全局属性
  app.config.globalProperties.$qiankun = props
  
  // 挂载逻辑
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
  
  console.log('子应用挂载容器:', containerElement)
  app.mount(containerElement)
  
  // 路由就绪检查
  router.isReady().then(() => {
    console.log('子应用路由就绪')
  })
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

## 生命周期管理最佳实践

### 1. 资源管理

确保在 `unmount` 阶段正确清理所有资源：

```typescript
unmount() {
  console.log('子应用 unmount')
  // 清理定时器
  if (timer) {
    clearInterval(timer)
  }
  
  // 取消网络请求
  if (abortController) {
    abortController.abort()
  }
  
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
  
  // 销毁应用实例
  if (app) {
    app.unmount()
    app = null
  }
}
```

### 2. 状态保持

在微前端环境中，可能需要在卸载时保持某些状态：

```typescript
let appState = {}

unmount() {
  console.log('子应用 unmount')
  // 保存需要保持的状态
  appState = {
    user: store.user,
    preferences: store.preferences
  }
  
  if (app) {
    app.unmount()
    app = null
  }
}

mount(props) {
  console.log('子应用 mount', props)
  // 恢复保存的状态
  if (Object.keys(appState).length > 0) {
    store.user = appState.user
    store.preferences = appState.preferences
  }
  
  initApp(props)
}
```

### 3. 错误处理

在生命周期函数中实现完善的错误处理：

```typescript
mount(props) {
  try {
    console.log('子应用 mount', props)
    initApp(props)
  } catch (error) {
    console.error('子应用挂载失败:', error)
    // 错误上报或显示错误页面
  }
}
```

## 独立运行与微前端模式兼容

子应用需要同时支持独立运行和作为微前端嵌入两种模式：

```typescript
// 微前端环境检测
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
export const isQiankunEnv = qiankunWindow.__POWERED_BY_QIANKUN__;

// 独立运行时初始化
if (!isQiankunEnv) {
  initApp()
}

// 微前端模式下通过生命周期函数初始化
renderWithQiankun({
  // 生命周期函数实现
})
```

## 调试技巧

1. **日志输出**：在每个生命周期函数中添加详细的日志输出
2. **状态监控**：监控应用状态变化，确保生命周期正确执行
3. **性能分析**：分析生命周期函数的执行时间，优化性能
4. **错误追踪**：实现完善的错误追踪机制