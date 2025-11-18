# 主应用与子应用通信机制

主应用与子应用之间的通信是微前端架构中的重要组成部分。本项目通过多种方式实现主子应用间的通信。

## 通信方式

### 1. Props 传递

主应用通过 props 向子应用传递数据，在 [utils/index.ts](/src/utils/index.ts) 中配置：

```typescript
export const getSubApp = () => {
    return [
        {
            name: '子应用',
            entry: 'http://localhost:8082',
            container: '#micro-app-container',
            activeRule: '/qiankun-vite-sub',
            props: {
                routerBase: '/qiankun-vite-sub',
                mainAppInfo: {
                    name: '主应用的全局参数传给子应用'
                }
            }
        }
    ]
};
```

子应用在 [main.ts](/src/main.ts) 中接收 props：

```typescript
function initApp(props: any = {}) {
  const { container } = props
  
  // 使用传递的props数据
  app.config.globalProperties.$qiankun = props
  
  // 其他初始化逻辑...
}
```

### 2. 全局状态管理

使用 Qiankun 提供的全局状态管理功能实现主子应用间的状态同步。

在主应用的 [micro/index.ts](/src/micro/index.ts) 中初始化全局状态：

```typescript
const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: null,
  theme: 'default',
  permissions: []
})
```

在子应用中使用全局状态：

```typescript
// 子应用中获取全局状态
import { getMasterOptions } from 'vite-plugin-qiankun/dist/helper';

const { onGlobalStateChange, setGlobalState } = getMasterOptions() || {};
```

### 3. 事件总线

通过自定义事件总线实现主子应用间的通信。

在主应用的 [shared/eventBus.ts](/src/shared/eventBus.ts) 中实现事件总线：

```typescript
class EventBus {
  private events: Map<string, Function[]> = new Map();

  // 订阅事件
  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);
  }

  // 发布事件
  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  // 取消订阅
  off(event: string, callback: Function) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const eventBus = new EventBus();
```

## 通信实践示例

### 主应用向子应用发送消息

```typescript
// 主应用中
import { setGlobalState } from '@/micro';

// 更新全局状态
setGlobalState({
  user: {
    name: 'John',
    id: 123
  }
});
```

### 子应用监听主应用状态变化

```typescript
// 子应用中
import { getMasterOptions } from 'vite-plugin-qiankun/dist/helper';

const { onGlobalStateChange } = getMasterOptions() || {};

onGlobalStateChange?.((state, prevState) => {
  console.log('主应用状态变化:', state, prevState);
  // 处理状态变化
});
```

### 子应用向主应用发送消息

```typescript
// 子应用中
import { getMasterOptions } from 'vite-plugin-qiankun/dist/helper';

const { setGlobalState } = getMasterOptions() || {};

// 更新全局状态
setGlobalState?.({
  subAppData: {
    message: '来自子应用的消息'
  }
});
```

## 通信最佳实践

1. **数据流清晰**：确保通信方向明确，避免循环依赖
2. **状态同步**：合理使用全局状态管理，确保主子应用状态同步
3. **错误处理**：实现完善的错误处理机制，确保通信的稳定性
4. **性能优化**：避免频繁的通信操作，减少不必要的数据传输
5. **类型安全**：使用 TypeScript 定义通信数据结构，确保类型安全
6. **文档化**：详细记录通信接口和数据结构，便于维护和协作

## 注意事项

1. **跨域问题**：在开发环境中注意处理跨域问题
2. **安全性**：避免传递敏感信息，确保通信安全
3. **版本兼容**：确保主子应用间的接口兼容性
4. **调试工具**：使用浏览器开发者工具调试通信问题