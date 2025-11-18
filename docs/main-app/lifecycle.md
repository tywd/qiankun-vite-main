# 主应用生命周期管理

主应用的生命周期管理主要涉及微应用的注册、启动、加载和卸载等过程。

## 微应用注册

在 [main.ts](/src/main.ts) 中，主应用在路由就绪后进行微应用注册：

```typescript
// 等待路由就绪后进行微前端初始化（但不立即启动）
router.isReady().then(() => {
  console.log('主应用路由就绪，初始化微前端配置')
  
  // 注册微应用（只注册，不启动）
  registerApps()
  
  // 设置错误处理
  setupErrorHandler()
  
  console.log('微前端配置初始化完成，等待用户访问时启动')
})

注册逻辑在 [micro/index.ts](/src/micro/index.ts) 中实现：

```typescript
// 注册微应用
export function registerApps() {
  console.log('注册微应用配置:', microApps)
  
  registerMicroApps(microApps, {
    beforeLoad: (app) => {
      console.log('开始加载微应用:', app.name, 'entry:', app.entry)
      appEvents.mounted(app.name)
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
      appEvents.unmounted(app.name)
      return Promise.resolve()
    }
  })
}

## 微应用启动

微应用的启动采用按需启动方式，在 [SubApp.vue](/src/components/SubApp.vue) 组件中实现：

```typescript
onMounted(async () => {
  await nextTick()
  
  // 确保容器元素存在
  const container = document.querySelector('#micro-app-container')
  if (container) {
    console.log('微应用容器已就绪:', container)
    
    try {
      // 容器就绪后，立即启动qiankun（如果还没有启动的话）
      await startMicroAppsOnDemand()
      console.log('qiankun启动成功，微应用将被加载')
      loading.value = false
    } catch (startError) {
      console.error('qiankun启动失败:', startError)
      errorTitle.value = '子应用加载失败，请确认子应用是否已启动'
      error.value = `qiankun启动失败: ${(startError as Error).message || '未知错误'}`
      loading.value = false
    }
  } else {
    error.value = '微应用容器初始化失败，找不到容器，请检查挂载的容器是否存在'
    loading.value = false
  }
})

按需启动逻辑在 [micro/index.ts](/src/micro/index.ts) 中实现：

```typescript
// 全局标记，确保qiankun只启动一次
let isQiankunStarted = false

// 按需启动微前端（当容器元素存在时调用）
export function startMicroAppsOnDemand() {
  if (isQiankunStarted) {
    console.log('qiankun已经启动，跳过重复启动')
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    // 检查容器是否存在
    const container = document.querySelector('#micro-app-container')
    if (!container) {
      console.error('微前端容器不存在，无法启动qiankun')
      reject(new Error('Container not found'))
      return
    }

    console.log('容器已存在，开始启动qiankun')
    
    try {
      start({
        prefetch: 'all', // 预加载所有微应用
        sandbox: {
          strictStyleIsolation: false,  // 关闭严格样式隔离，避免Element Plus样式问题
          experimentalStyleIsolation: false // 关闭实验性样式隔离，减少样式冲突
        },
        singular: false, // 是否为单实例场景
        fetch: (url, options) => {
          // 自定义fetch，增强错误处理
          console.log('正在加载微应用资源:', url)
          return window.fetch(url, {
            ...options,
            mode: 'cors',
            credentials: 'omit'
          }).catch(error => {
            console.error('微应用资源加载失败:', url, error)
            throw error
          })
        }
      })
      
      isQiankunStarted = true
      console.log('qiankun启动成功')
      resolve()
    } catch (error) {
      console.error('qiankun启动失败:', error)
      reject(error)
    }
  })
}

## 错误处理

主应用实现了全局错误处理机制：

```typescript
// 全局错误处理
export function setupErrorHandler() {
  addGlobalUncaughtErrorHandler((event) => {
    console.error('微应用加载错误:', event)
    console.error('错误类型:', typeof event)
    console.error('错误详情:', JSON.stringify(event, null, 2))
    appEvents.error('unknown', event)
    // 这里可以添加错误上报逻辑
  })
}

## 生命周期最佳实践

1. **按需启动**：只有在需要时才启动微前端框架，避免不必要的资源消耗
2. **错误处理**：实现完善的错误处理机制，确保应用的稳定性
3. **资源清理**：在微应用卸载时正确清理资源，避免内存泄漏
4. **状态管理**：通过事件总线等方式管理主应用与子应用之间的状态同步
5. **性能优化**：合理配置预加载策略，提升用户体验