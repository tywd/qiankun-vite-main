// TODO
// 获取子应用列表(如果加了新的子应用，需要在主应用此处注册好新的子应用信息)
// 获取主应用与所有子应用的 appTab
export const getAllApp = () => {
    const subAppList: any[] = getSubApp();
    const subArr: any[] = subAppList.map((app: any) => (
        {
            id: app.name,
            app: app.name,
            name: app.name,
            path: app.activeRule,
            isActive: false
        }
    ));
    const allAppTab: any[] = [
        {
            id: 'main',
            app: 'main',
            name: '首页',
            path: '/dashboard',
            isActive: true
        }, ...subArr
    ];
    return allAppTab;
};

// 获取主应用路由
export const getMainRoute = () => {
    return [
        {
            id: 'user',
            title: '用户管理',
            name: 'user',
            icon: 'User',
            level: 1,
            path: '/user',
            meta: { title: '用户管理' },
            children: [
                {
                    id: 'userList',
                    title: '用户列表',
                    name: 'userList',
                    icon: 'List',
                    level: 2,
                    parentId: 'user',
                    path: '/user/user-list',
                    meta: { title: '用户列表' }
                },
                {
                    id: 'userRoles',
                    title: '角色管理',
                    name: 'userRoles',
                    icon: 'Setting',
                    level: 2,
                    parentId: 'user',
                    path: '/user/user-role',
                    meta: { title: '用户角色' }
                }
            ]
        },
        {
            id: 'child',
            title: '子应用管理',
            name: 'child',
            icon: 'Setting',
            level: 1,
            path: '/child',
            meta: { title: '子应用管理' },
            children: [
                {
                    id: 'childList',
                    title: '子应用列表',
                    name: 'childList',
                    path: '/child/child-list',
                    icon: 'Grid',
                    level: 2,
                    parentId: 'child',
                    meta: { title: '子应用列表' }
                },
                {
                    id: 'childApply',
                    title: '子应用申请',
                    name: 'childApply',
                    path: '/child/child-apply',
                    icon: 'CirclePlus',
                    level: 2,
                    parentId: 'child',
                    meta: { title: '子应用申请' }
                }
            ]
        }
    ]
}

// TODO
// 获取子应用列表(如果加了新的子应用，需要在主应用此处注册好新的子应用信息)
export const getSubApp = () => {
    // 在生产环境中使用 Vercel 部署地址，开发环境中使用本地地址
    const isProd = process.env.NODE_ENV === 'production';
    const subAppEntry = isProd 
        ? 'https://your-sub-app.vercel.app' // 替换为实际的 Vercel 部署地址
        : 'http://localhost:8081';

    return [
        {
            name: '子应用', // 子应用名称
            entry: subAppEntry, // 子应用入口
            container: '#micro-app-container', // 挂载容器
            activeRule: '/sub-app', // 激活路由
            props: {
                // setGlobalState,
                mainAppInfo: {
                    name: '主应用的全局参数传给子应用'
                }
            }
        }
    ]
};

// TODO
// 获取子应用路由(如果加了新的子应用，需要在主应用此处注册好新的子应用路由信息)
export const getSubRoute = () => {
    return [
        {
            path: '/sub-app/:path(.*)*',
            name: 'subApp',
            component: () => import('@/components/SubApp.vue'),
            meta: { title: '子应用' }
        }
    ]
}

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
        if (route.children && route.children.length > 0) {
            transformd.children = transformRoutes(route.children);
        } else {
            // 检查组件是否存在
            if (viewModules[`/src/views${route.path}.vue`]) {
                transformd.component = viewModules[`/src/views${route.path}.vue`];
            } else {
                // 如果组件不存在，提供一个默认组件并添加错误处理
                transformd.component = () => import('@/views/index.vue').catch(() => {
                    return Promise.resolve({
                        template: '<div>页面开发中...</div>'
                    });
                });
            }
        }
        return transformd;
    })
    console.log('newRoutes', newRoutes)
    return newRoutes;
}

// 处理原始route路径为菜单可用的格式
export const transformMenu = (routes: any[]): any[] => {
    const menu: any[] = routes.map(route => {
        const transformd: any = {
            id: route.id,
            title: route.title,
            icon: route.icon,
            level: route.level,
            path: route.path,
            parentId: route.parentId
        }
        if (route.children && route.children.length > 0) {
            transformd.children = transformMenu(route.children);
        }
        return transformd
    })
    return menu;
}