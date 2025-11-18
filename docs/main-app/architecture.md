# 主应用架构详解

## 整体架构

主应用采用典型的 Vue 3 + Vite 架构，同时集成了 Qiankun 微前端框架来管理子应用。

### 核心模块

1. **布局系统**：提供统一的页面布局，包括头部、侧边栏、标签页等
2. **路由系统**：基于 Vue Router 实现，负责主应用和子应用的路由管理
3. **微前端系统**：基于 Qiankun 实现，负责子应用的注册、加载和通信
4. **状态管理系统**：基于 Pinia 实现，管理全局状态
5. **通信系统**：提供主应用与子应用之间的通信机制

## 微前端集成

主应用通过 Qiankun 框架实现微前端集成，主要包含以下组件：

### 1. 微应用容器

在 [SubApp.vue](/src/components/SubApp.vue) 组件中实现了微应用的加载和容器管理：

```vue
<template>
  <div class="sub-app-container">
    <!-- 微应用容器 -->
    <div 
      id="micro-app-container" 
      ref="containerRef"
      class="micro-app-content"
      v-show="!loading"
    ></div>
  </div>
</template>
```

### 2. 微应用注册

在 [micro/index.ts](/src/micro/index.ts) 中实现微应用的注册：

```typescript
// 注册微应用
export function registerApps() {
  registerMicroApps(microApps, {
    beforeLoad: (app) => {
      console.log('开始加载微应用:', app.name)
      return Promise.resolve()
    },
    // ... 其他生命周期钩子
  })
}
```

### 3. 子应用配置

在 [utils/index.ts](/src/utils/index.ts) 中配置子应用信息：

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

## 路由管理

主应用的路由分为两部分：

1. **主应用路由**：处理主应用自身的页面路由
2. **子应用路由**：为子应用提供路由占位符

### 路由配置示例

```typescript
// 主应用路由
{
  path: '/user',
  name: 'user',
  component: () => import('@/views/user/user-list.vue')
}

// 子应用路由占位符
{
  path: '/qiankun-vite-sub/:path(.*)*',
  name: 'subApp',
  component: () => import('@/components/SubApp.vue')
}
```

## 状态管理

主应用使用 Pinia 进行状态管理，主要包括：

1. **用户状态**：管理用户登录信息
2. **菜单状态**：管理侧边栏菜单
3. **标签页状态**：管理页面标签页
4. **应用标签状态**：管理主应用和子应用的标签

## 样式隔离

为避免主应用与子应用之间的样式冲突，采用了以下策略：

1. **CSS 命名空间**：为主应用的样式添加特定前缀
2. **样式作用域**：使用 Vue 的 scoped CSS
3. **Qiankun 沙箱**：利用 Qiankun 提供的样式隔离机制