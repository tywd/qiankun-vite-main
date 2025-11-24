# 主子应用独立部署

主应用和子应用可以独立部署到不同的服务器或平台上。

## 部署架构

```
主应用服务器 (https://main-app.com)
│
├── 主应用静态资源
└── API服务

子应用服务器 (https://sub-app.com)
│
└── 子应用静态资源
```

## 主应用配置

在主应用的 [utils/index.ts](../../src/utils/index.ts) 中配置子应用信息：

```typescript
export const getSubApp = () => {
    return [
        {
            name: '子应用',
            entry: 'https://sub-app.com',  // 子应用部署地址
            container: '#micro-app-container',
            activeRule: '/sub-app',
            props: {
                routerBase: '/sub-app',
                mainAppInfo: {
                    name: '主应用的全局参数传给子应用'
                }
            }
        }
    ]
};
```

## 子应用配置

### 路由配置

在子应用的 [router/index.ts](../../src/router/index.ts) 中配置路由基础路径：

```typescript
import { baseUrl } from '@/micro';

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes
});
```

### 环境变量

在子应用的 .env.production 文件中配置基础路径：

```bash
BASE_PATH=/sub-app
```

### Vite配置

在子应用的 vite.config.ts 中使用环境变量：

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = env.BASE_PATH || '/';
  
  return {
    base: basePath,
    // 其他配置...
  }
})
```

## 部署步骤

### 1. 构建主应用

```bash
cd qiankun-vite-main
pnpm install
pnpm build
```

### 2. 构建子应用

```bash
cd qiankun-vite-sub
pnpm install
pnpm build
```

### 3. 部署主应用

将主应用的 dist 目录部署到服务器：

```bash
# 示例：部署到Nginx
cp -r dist/* /var/www/main-app/
```

### 4. 部署子应用

将子应用的 dist 目录部署到服务器：

```bash
# 示例：部署到Nginx
cp -r dist/* /var/www/sub-app/
```

## Nginx配置示例

### 主应用Nginx配置

```nginx
server {
    listen 80;
    server_name main-app.com;
    
    location / {
        root /var/www/main-app;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server;
    }
}
```

### 子应用Nginx配置

```nginx
server {
    listen 80;
    server_name sub-app.com;
    
    location / {
        root /var/www/sub-app;
        try_files $uri $uri/ /index.html;
    }
}
```

## 跨域配置

如果主应用和子应用部署在不同域名下，需要配置跨域支持。

### 子应用跨域配置

在子应用的 vite.config.ts 中配置：

```typescript
export default defineConfig({
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  }
})
```

## 常见问题

### 1. 子应用资源加载失败

**问题**: 控制台报错 "Failed to load module script"

**解决方案**:
1. 检查子应用服务器是否正确配置CORS头
2. 确认子应用的Vite配置中添加了跨域支持
3. 检查网络请求是否被浏览器阻止

### 2. 样式隔离问题

**问题**: 主应用和子应用样式相互影响

**解决方案**:
1. 在主应用中启用Qiankun的样式隔离
2. 子应用使用CSS Modules或BEM命名规范
3. 为主应用和子应用添加不同的CSS命名空间

### 3. 路由问题

**问题**: 页面刷新后出现404错误

**解决方案**:
1. 确保Nginx配置了正确的try_files规则
2. 检查路由配置是否正确
3. 确认服务器支持SPA应用的路由模式

## 最佳实践

1. **域名规划**: 合理规划主应用和子应用的域名
2. **版本管理**: 建立完善的版本管理机制
3. **监控告警**: 部署监控系统，及时发现和解决问题
4. **备份策略**: 制定数据备份和恢复策略
5. **安全防护**: 配置SSL证书，加强安全防护