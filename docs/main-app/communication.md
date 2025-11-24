# 主应用与子应用通信机制

在微前端架构中，主应用与子应用之间的通信是一个重要的话题。本项目提供了多种通信方式来满足不同的需求。

## 1. Props 通信

主应用通过 props 向子应用传递数据，在 [utils/index.ts](../../src/utils/index.ts) 中配置：

```typescript
{
  name: '子应用',
  entry: '//localhost:8082',
  container: '#micro-app-container',
  activeRule: '/qiankun-vite-sub',
  props: {
    routerBase: '/qiankun-vite-sub',
    mainAppInfo: {
      name: '主应用的全局参数传给子应用'
    }
  }
}
```

子应用在 [main.ts](../../src/main.ts) 中接收 props：

```typescript
function initApp(props: any = {}) {
  const { container, mainAppInfo } = props
  // 使用接收到的 props 数据
  console.log('来自主应用的数据:', mainAppInfo)
}
```

## 2. 全局状态通信

Qiankun 提供了全局状态管理机制，可以在主应用和子应用之间共享状态。

在主应用的 [micro/index.ts](../../src/micro/index.ts) 中初始化全局状态：

```typescript
import { initGlobalState } from 'qiankun'

// 初始化全局状态
const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: null,
  theme: 'default'
})
```

在主应用的 [shared/eventBus.ts](../../src/shared/eventBus.ts) 中实现事件总线：

```typescript
// 全局事件总线
export const globalEventBus = {
  // 事件监听
  on(event: string, callback: Function) {
    // 实现事件监听逻辑
  },
  
  // 事件触发
  emit(event: string, data?: any) {
    // 实现事件触发逻辑
  }
}
```

## 3. 自定义事件通信

除了 Qiankun 提供的通信机制外，还可以通过自定义事件进行通信。

### 主应用向子应用发送消息

```typescript
// 主应用中
setGlobalState({
  message: '来自主应用的消息'
})
```

### 子应用接收消息

```typescript
// 子应用中
onGlobalStateChange((state, prev) => {
  console.log('全局状态变化:', state)
})
```

## 4. 路由通信

主应用和子应用可以通过路由参数进行通信。

### 主应用导航到子应用并传递参数

```typescript
// 主应用中
router.push('/qiankun-vite-sub?userId=123')
```

### 子应用获取路由参数

```typescript
// 子应用中
const route = useRoute()
const userId = route.query.userId
```