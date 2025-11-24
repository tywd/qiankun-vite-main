# 子应用生命周期实现

子应用需要实现完整的Qiankun生命周期函数，包括bootstrap、mount、unmount和update。

## 生命周期函数实现

在子应用的 [main.ts](../../src/main.ts) 中完整实现生命周期函数：

```typescript
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'

// 初始化应用
function initApp(props: any = {}) {
  const { container } = props
  
  // 应用初始化逻辑
  app = createApp(App)
  app.use(router).use(pinia)
  
  // 挂载应用
  const containerElement = container ? container : document.querySelector('#app')
  app.mount(containerElement)
}

// Qiankun生命周期函数
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

## 生命周期函数说明

### bootstrap

bootstrap生命周期函数只会在微应用初始化时执行一次，下次微应用重新进入时会直接跳过bootstrap。

```typescript
bootstrap() {
  console.log('子应用 bootstrap')
  // 在这里可以做一些初始化工作，比如建立全局缓存等
}
```

### mount

mount生命周期函数在应用每次进入时都会执行。

```typescript
mount(props) {
  console.log('子应用 mount', props)
  // 初始化应用并挂载
  initApp(props)
}
```

### unmount

unmount生命周期函数在应用每次卸载时都会执行。

```typescript
unmount() {
  console.log('子应用 unmount')
  // 清理应用实例
  if (app) {
    app.unmount()
    app = null
  }
}
```

### update

update生命周期函数会在微应用状态发生改变时调用。

```typescript
update() {
  console.log('子应用 update')
  // 处理状态更新
}
```

## 容器元素处理

在mount生命周期中，需要正确处理主应用提供的容器元素：

```typescript
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
```

## 生命周期最佳实践

1. **状态管理**：在生命周期函数中正确管理应用状态，避免内存泄漏
2. **资源清理**：在unmount函数中清理所有资源，包括定时器、事件监听器等
3. **错误处理**：在生命周期函数中实现完善的错误处理机制
4. **性能优化**：合理使用bootstrap函数进行初始化优化
5. **兼容性**：确保生命周期函数在独立运行和微前端环境中都能正常工作
