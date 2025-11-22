import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAppTabsStore } from '@/stores/appTabs';
import { useTabsStore } from '../stores/tabs';
import { useMenuStore } from '../stores/menu';
import { getSubRoute, getMainRoute, getAllApp, transformRoutes } from '@/utils';
import type { AppNavTab } from '@/types';

// 主应用基础路由（默认不可动，本地写死）
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'Dashboard'
    }
  },
  {
    path: '/user-center',
    name: 'userCenter',
    component: () => import('@/views/user-center.vue'),
    meta: { title: '个人中心' }
  },
  {
    path: '/system',
    name: 'system',
    children: [
      {
        path: '/system/setting',
        name: 'setting',
        component: () => import('@/views/system/setting.vue'),
        meta: { title: '系统设置' }
      }
    ]
  },
  {
    // 兜底路由：处理所有未匹配的路径
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  },
  // 添加测试组件路由
  {
    path: '/test',
    name: 'test',
    component: () => import('@/components/TestComponent.vue'),
    meta: { title: '样式测试' }
  },
]


// 主应用其他可变动路由
const _routes: any[] = getMainRoute()
const mainRoutes: RouteRecordRaw[] = transformRoutes(_routes);
// 子应用路由，子应用会挂载到这个路由下
const subRoutes: RouteRecordRaw[] = getSubRoute();
const routes: RouteRecordRaw[] = [...baseRoutes, ...mainRoutes, ...subRoutes];
console.log('routes-主应用路由', routes);

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  console.log('main-路由守卫', to, from);
  const appTabsStore = useAppTabsStore();
  const appList = getAllApp();
  if (!appList.length) return;
  if (appTabsStore.navTabs.length === 0) {
    appList.forEach((app: any) => {
      appTabsStore.addNavTab(app);
    });
  }
  const mainRoutes: string[] = ['/dashboard', '/user-center', '/system', '/child'] // 主应用的路由
  if (mainRoutes.some(route => to.path.startsWith(route))) { // 激活主应用
    const activeApp: AppNavTab | undefined = appTabsStore.navTabs.find(tab => tab.app === 'main');
    appTabsStore.setActiveTab(activeApp?.id || '');

    const tabsStore = useTabsStore();
    const menuStore = useMenuStore();
    menuStore.mergeMenu(getMainRoute());
    if (to.meta?.title) {
      document.title = to.meta.title as string
      // 主应用设置激活左侧sidebar的菜单
      const menuItem = menuStore.findMenuByPath(to.path);
      if (menuItem) {
        menuStore.setActiveMenu(menuItem.id);
        // 主应用添加标签页
        tabsStore.addTab({
          id: menuItem.id,
          name: to.meta.title as string,
          path: to.path,
          closable: to.path !== '/dashboard', // 首页不可关闭
        });
      }
    }
  } else { // 激活子应用
    appTabsStore.navTabs.forEach(tab => {
      if (to.path.startsWith(tab.path)) {
        appTabsStore.setActiveTab(tab.id);
        return;
      }
    });
  }
  next()
})

router.afterEach((to: RouteLocationNormalized) => {
  console.log('主应用路由切换完成:', to.path)
})

export default router