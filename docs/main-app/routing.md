# 主应用路由配置

主应用的路由配置基于 Vue Router，同时需要为子应用提供路由占位符。

## 路由结构

主应用的路由分为两部分：

1. **主应用路由**：处理主应用自身的页面路由
2. **子应用路由**：为子应用提供路由占位符

## 路由配置文件

主应用的路由配置在 [router/index.ts](../../src/router/index.ts) 文件中。

子应用路由配置在 [utils/index.ts](../../src/utils/index.ts) 中定义：

```typescript
// 子应用路由占位符
export const getSubRoute = () => {
  return [
    {
      path: '/qiankun-vite-sub/:path(.*)*',
      name: 'subApp',
      component: () => import('@/components/SubApp.vue'),
      meta: { title: '子应用' }
    }
  ]
}
```

在 [utils/index.ts](../../src/utils/index.ts) 中提供了路由转换函数：

```typescript
// 处理原始route路径为 vue-router可用的格式
export const transformRoutes = (routes: any[]): any[] => {
  // 使用 import.meta.glob 预加载所有视图组件，避免动态导入路径问题
  const viewModules = import.meta.glob('@/views/**/*.vue');

  const newRoutes: any[] = routes.map(route => {
    const transformd: any = {
      path: route.path,
      name: route.name,
      meta: route.meta
    }
    // ... 路由转换逻辑
  })
  return newRoutes;
}
```

## 路由整合

在主应用的路由配置中，将主应用路由和子应用路由进行整合：

```typescript
// 主应用其他可变动路由
const _routes: any[] = getMainRoute()
const mainRoutes: RouteRecordRaw[] = transformRoutes(_routes);
// 子应用路由，子应用会挂载到这个路由下
const subRoutes: RouteRecordRaw[] = getSubRoute();
const routes: RouteRecordRaw[] = [...baseRoutes, ...mainRoutes, ...subRoutes];
```

## 路由守卫

主应用通过路由守卫来处理主应用和子应用的激活状态：

```typescript
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 判断是主应用路由还是子应用路由
  const mainRoutes: string[] = ['/dashboard', '/user-center', '/system', '/child']
  if (mainRoutes.some(route => to.path.startsWith(route))) {
    // 激活主应用
  } else {
    // 激活子应用
  }
  next()
})
```