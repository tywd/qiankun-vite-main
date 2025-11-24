# 主应用生命周期管理

主应用的生命周期管理主要涉及微应用的注册、启动和卸载等过程。

## 微应用注册

在 [main.ts](../../src/main.ts) 中，主应用在路由就绪后进行微应用注册：

```typescript
// 路由就绪后注册微应用
router.isReady().then(() => {
  // 注册微应用
  registerApps()
  // 启动微前端
  startMicroApps()
})
```

注册逻辑在 [micro/index.ts](../../src/micro/index.ts) 中实现：

```typescript
// 注册微应用
export function registerApps() {
  registerMicroApps(microApps, {
    beforeLoad: (app) => {
      console.log('开始加载微应用:', app.name)
      return Promise.resolve()
    },
    beforeMount: (app) => {
      console.log('开始挂载微应用:', app.name)
      return Promise.resolve()
    },
    afterMount: (app) => {
      console.log('微应用挂载完成:', app.name)
      return Promise.resolve()
    },
    beforeUnmount: (app) => {
      console.log('开始卸载微应用:', app.name)
      return Promise.resolve()
    },
    afterUnmount: (app) => {
      console.log('微应用卸载完成:', app.name)
      return Promise.resolve()
    }
  })
}
```

## 微应用启动

微应用的启动采用按需启动方式，在 [SubApp.vue](../../src/components/SubApp.vue) 组件中实现：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { startMicroAppsOnDemand } from '../micro'

onMounted(async () => {
  // 容器就绪后，立即启动qiankun（如果还没有启动的话）
  await startMicroAppsOnDemand()
})
</script>
```

按需启动逻辑在 [micro/index.ts](../../src/micro/index.ts) 中实现：

```typescript
// 按需启动微前端（当容器元素存在时调用）
export function startMicroAppsOnDemand() {
  // 检查容器是否存在
  const container = document.querySelector('#micro-app-container')
  if (!container) {
    console.error('微前端容器不存在，无法启动qiankun')
    return Promise.reject(new Error('Container not found'))
  }

  return new Promise<void>((resolve, reject) => {
    try {
      start({
        prefetch: 'all', // 预加载所有微应用
        sandbox: {
          strictStyleIsolation: false,  // 关闭严格样式隔离，避免Element Plus样式问题
          experimentalStyleIsolation: true // 启用实验性样式隔离，确保子应用样式正确应用
        }
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
```

## 微应用卸载

当组件卸载时，需要正确清理微应用：

```typescript
// 全局错误处理
export function setupErrorHandler() {
  addGlobalUncaughtErrorHandler((event) => {
    console.error('微应用加载错误:', event)
    // 错误处理逻辑
  })
}
```

## 生命周期最佳实践

1. **延迟注册**：在路由就绪后再注册微应用，确保路由系统正常工作
2. **按需启动**：只在需要时启动微前端，提升应用性能
3. **错误处理**：实现完善的错误处理机制，确保应用稳定性
4. **资源清理**：在适当的时候清理微应用资源，避免内存泄漏