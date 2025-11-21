# 主子应用独立部署

本指南介绍主应用和子应用的独立部署配置，适用于主应用和子应用位于不同仓库的情况。

## 独立部署架构

在独立部署架构中，主应用和子应用分别部署到不同的 Vercel 项目，它们之间通过配置进行集成。

### 部署优势

1. **独立开发**：主应用和子应用可以独立开发和测试
2. **独立部署**：每个应用可以独立部署，互不影响
3. **灵活扩展**：可以根据需要独立扩展各个应用
4. **团队协作**：不同团队可以负责不同的应用

## 主应用独立部署

### 1. 项目配置

确保主应用项目包含以下配置文件：

1. [package.json](/package.json)：包含构建脚本
2. [vercel.json](/vercel.json)：Vercel 配置文件
3. [vite.config.ts](/vite.config.ts)：Vite 配置文件

### 2. 环境变量

在主应用的 Vercel 项目设置中配置环境变量：

```bash
VITE_USER_MANAGEMENT_URL=https://user-management.vercel.app
VITE_SYSTEM_MANAGEMENT_URL=https://system-management.vercel.app
```

### 3. 子应用配置

在主应用的 [utils/index.ts](/src/utils/index.ts) 中配置子应用信息：

```typescript
export const getSubApp = () => {
    // 在生产环境中使用 Vercel 部署地址，开发环境中使用本地地址
    const isProd = process.env.NODE_ENV === 'production';
    const userManagementEntry = isProd 
        ? process.env.VITE_USER_MANAGEMENT_URL || 'https://user-management.vercel.app'
        : 'http://localhost:8082';
        
    const systemManagementEntry = isProd 
        ? process.env.VITE_SYSTEM_MANAGEMENT_URL || 'https://system-management.vercel.app'
        : 'http://localhost:8083';

    return [
        {
            name: '用户管理',
            entry: userManagementEntry,
            container: '#micro-app-container',
            activeRule: '/user-management',
            props: {
                routerBase: '/user-management',
                mainAppInfo: {
                    name: '主应用传递给用户管理子应用的信息'
                }
            }
        },
        {
            name: '系统管理',
            entry: systemManagementEntry,
            container: '#micro-app-container',
            activeRule: '/system-management',
            props: {
                routerBase: '/system-management',
                mainAppInfo: {
                    name: '主应用传递给系统管理子应用的信息'
                }
            }
        }
    ]
};
```

## 子应用独立部署

### 1. 项目配置

确保子应用项目包含以下配置文件：

1. [package.json](/package.json)：包含构建脚本
2. [vercel.json](/vercel.json)：Vercel 配置文件
3. [vite.config.ts](/vite.config.ts)：Vite 配置文件

### 2. 环境变量

在子应用的 Vercel 项目设置中配置环境变量：

```bash
BASE_PATH=/user-management
```

注意：`BASE_PATH` 的值必须与主应用中配置的 `activeRule` 保持一致。

### 3. Vite 配置

在子应用的 [vite.config.ts](/vite.config.ts) 中配置基础路径：

```typescript
// 获取基础路径，Vercel部署时使用环境变量，本地开发时使用默认值
const base = process.env.BASE_PATH || '/';

// https://vite.dev/config/
export default defineConfig({
  base: base, // 设置基础路径，确保在Vercel上正确部署
  // 其他配置...
})
```

### 4. 路由配置

在子应用的 [router/index.ts](/src/router/index.ts) 中配置路由基础路径：

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { isQiankunEnv } from '@/micro'

const router = createRouter({
  history: createWebHistory(isQiankunEnv ? process.env.BASE_PATH || '/' : '/'),
  routes
})

export default router
```

## 部署流程

### 1. 主应用部署流程

1. 将主应用代码推送到 GitHub 仓库
2. 在 Vercel 中创建新项目并连接到主应用仓库
3. 配置环境变量
4. 触发部署
5. 记录主应用的部署地址

### 2. 子应用部署流程

1. 将子应用代码推送到 GitHub 仓库
2. 在 Vercel 中创建新项目并连接到子应用仓库
3. 配置环境变量（特别是 BASE_PATH）
4. 触发部署
5. 记录子应用的部署地址

### 3. 集成配置

1. 更新主应用中子应用的 entry 配置为实际的 Vercel 部署地址
2. 重新部署主应用以应用更改

## 自动化部署

### GitHub Actions 配置

为每个应用配置独立的 GitHub Actions 工作流：

**主应用工作流 (.github/workflows/deploy-main.yml)：**

```yaml
name: Deploy Main App to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm build

      - name: Deploy to Vercel (Preview)
        if: github.event_name == 'pull_request'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy to Vercel (Production)
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**子应用工作流 (.github/workflows/deploy-sub.yml)：**

```yaml
name: Deploy Sub App to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm build

      - name: Deploy to Vercel (Preview)
        if: github.event_name == 'pull_request'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_SUB_PROJECT_ID }}

      - name: Deploy to Vercel (Production)
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_SUB_PROJECT_ID }}
          vercel-args: '--prod'
```

### Secrets 配置

在每个 GitHub 仓库中配置相应的 Secrets：

**主应用仓库 Secrets：**
- `VERCEL_TOKEN`: Vercel 访问令牌
- `VERCEL_ORG_ID`: Vercel 组织 ID
- `VERCEL_PROJECT_ID`: 主应用的 Vercel 项目 ID

**子应用仓库 Secrets：**
- `VERCEL_TOKEN`: Vercel 访问令牌
- `VERCEL_ORG_ID`: Vercel 组织 ID
- `VERCEL_SUB_PROJECT_ID`: 子应用的 Vercel 项目 ID

## 验证部署

### 1. 独立验证

1. 访问主应用部署地址，确认主应用正常运行
2. 访问子应用部署地址，确认子应用可以独立运行

### 2. 集成验证

1. 在主应用中导航到子应用路由
2. 确认子应用正确加载和显示
3. 检查主子应用间的通信是否正常

### 3. 错误排查

1. 检查浏览器控制台错误信息
2. 检查网络请求是否正常
3. 确认环境变量配置是否正确
4. 验证路由配置是否正确

## 最佳实践

### 1. 版本管理

1. 为主应用和子应用分别维护版本号
2. 在配置中记录版本信息，便于问题排查

### 2. 配置管理

1. 使用环境变量管理不同环境的配置
2. 避免在代码中硬编码部署地址

### 3. 监控和日志

1. 实现应用性能监控
2. 记录关键操作日志
3. 设置错误告警机制

### 4. 安全性

1. 保护敏感信息，如 API 密钥
2. 实现适当的访问控制
3. 定期更新依赖包