// 主应用路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/index.vue'),
    meta: { title: '首页' }
  }
]

// 合并主应用路由和子应用路由
const allRoutes = [...routes, ...getSubRoute()]

const router = createRouter({
  history: createWebHistory('/'),
  routes: allRoutes
})

export default router
```

## 子应用路由配置

子应用路由配置在 [utils/index.ts](/src/utils/index.ts) 中定义：

```typescript
// 获取子应用路由(如果加了新的子应用，需要在主应用此处注册好新的子应用路由信息)
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

## 路由工具函数

### 路由转换函数

在 [utils/index.ts](/src/utils/index.ts) 中提供了路由转换函数：

```typescript
// 处理原始route路径为 vue-router可用的格式
export const transformRoutes = (routes: any[]): RouteRecordRaw[] => {
    const newRoutes: RouteRecordRaw[] = routes.map((route: any) => {
        const transformd: any = {
            path: route.path,
            name: route.name,
            meta: route.meta
        }
        if (route.children && route.children.length > 0) {
            transformd.children = transformRoutes(route.children);
        } else {
            if (route.component) {
                // 动态导入组件
                transformd.component = () => import(`@/views${route.component}`).catch(() => {
                    return Promise.resolve({
                        template: '<div>页面开发中...</div>'
                    });
                });
            }
        }
        return transformd;
    })
    return newRoutes;
}
```

## 路由守卫

```typescript
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 权限检查逻辑
  const isAuthenticated = checkAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## 动态路由

```typescript
// 动态添加路由
router.addRoute({
  path: '/dynamic',
  name: 'dynamic',
  component: () => import('@/views/dynamic.vue')
})
```

## 路由最佳实践

1. **路由懒加载**：使用动态导入实现路由组件的懒加载，提升应用性能
2. **路由元信息**：通过 meta 字段存储路由相关信息，如标题、权限等
3. **路由守卫**：实现完善的路由守卫机制，确保应用安全性
4. **路由命名**：使用有意义的路由名称，便于维护和理解
5. **路由参数**：合理使用路由参数和查询参数，确保数据传递的正确性