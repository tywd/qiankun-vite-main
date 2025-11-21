# Vercel 部署

本指南详细介绍如何将主应用和子应用部署到 Vercel 平台。

## 部署前准备

### 1. 获取 Vercel 令牌

1. 登录到 [Vercel](https://vercel.com/)
2. 进入您的账户设置页面 (Settings > Tokens)
3. 创建一个新的令牌 (Create Token)
4. 保存令牌，稍后会用到

### 2. 获取组织 ID

1. 在 Vercel 控制台点击右上角头像
2. 选择 "Settings"
3. 在 "General" 选项卡中找到 "Organization ID"

## 主应用部署

### 1. 创建 Vercel 项目

1. 在 Vercel 控制台点击 "New Project"
2. 选择主应用的 GitHub 仓库
3. 设置项目名称（例如：qiankun-vite-main）
4. 保留其他默认设置

### 2. 配置环境变量

在主应用的 Vercel 项目设置中配置环境变量：

1. 进入项目设置页面
2. 选择 "Environment Variables" 选项卡
3. 添加以下环境变量：
   - `VITE_USER_MANAGEMENT_URL`: 用户管理子应用的部署地址
   - `VITE_SYSTEM_MANAGEMENT_URL`: 系统管理子应用的部署地址

### 3. 部署主应用

1. 在 Vercel 项目页面点击 "Deploy"
2. 等待构建和部署完成
3. 记录部署地址，稍后配置子应用时会用到

## 子应用部署

### 1. 创建 Vercel 项目

1. 在 Vercel 控制台点击 "New Project"
2. 选择子应用的 GitHub 仓库
3. 设置项目名称（例如：qiankun-vite-sub）
4. 保留其他默认设置

### 2. 配置环境变量

在子应用的 Vercel 项目设置中配置环境变量：

1. 进入项目设置页面
2. 选择 "Environment Variables" 选项卡
3. 添加以下环境变量：
   - `BASE_PATH`: /qiankun-vite-sub (需要与主应用中配置的 activeRule 保持一致)

### 3. 部署子应用

1. 在 Vercel 项目页面点击 "Deploy"
2. 等待构建和部署完成
3. 记录部署地址

## 配置主应用中的子应用信息

部署完成后，需要更新主应用中子应用的配置信息：

1. 打开主应用的 [utils/index.ts](/src/utils/index.ts) 文件
2. 将子应用的 entry 配置更新为实际的 Vercel 部署地址：

```typescript
export const getSubApp = () => {
    // 从环境变量获取子应用入口地址，如果没有则使用默认值
    const subAppEntry = process.env.VITE_SUB_APP_URL || 'https://qiankun-vite-sub.vercel.app';

    return [
        {
            name: '子应用', // 子应用名称
            entry: subAppEntry, // 子应用入口
            container: '#micro-app-container', // 挂载容器
            activeRule: '/sub-app', // 激活路由
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

## Vercel 环境变量配置

为了安全和灵活性，建议将敏感配置信息通过 Vercel 的环境变量功能进行管理，而不是硬编码在代码中。

### 主应用环境变量配置

在主应用的 Vercel 项目设置中配置以下环境变量：

1. 进入项目设置页面
2. 选择 "Environment Variables" 选项卡
3. 添加以下环境变量：
   - `VITE_SUB_APP_URL`: 子应用的部署地址 (例如: https://qiankun-vite-sub.vercel.app)

### 子应用环境变量配置

在子应用的 Vercel 项目设置中配置以下环境变量：

1. 进入项目设置页面
2. 选择 "Environment Variables" 选项卡
3. 添加以下环境变量：
   - `BASE_PATH`: /sub-app (需要与主应用中配置的 activeRule 保持一致)

## GitHub Actions 自动化部署

项目已配置 GitHub Actions 实现自动化部署，您可以在 `.github/workflows/deploy-vercel.yml` 文件中查看配置。

### 配置 Secrets

在 GitHub 仓库中配置以下 Secrets：

1. 进入仓库设置页面
2. 选择 "Secrets and variables" > "Actions"
3. 添加以下 secrets:
   - `VERCEL_TOKEN`: Vercel 访问令牌
   - `VERCEL_ORG_ID`: Vercel 组织 ID
   - `VERCEL_PROJECT_ID`: 主应用的 Vercel 项目 ID
   - `VERCEL_SUB_PROJECT_ID`: 子应用的 Vercel 项目 ID

## 验证部署

### 1. 访问主应用

1. 打开主应用的 Vercel 部署地址
2. 确认主应用正常加载

### 2. 访问子应用

1. 在主应用中导航到子应用的路由（/qiankun-vite-sub）
2. 确认子应用正常加载和显示

### 3. 检查控制台

1. 打开浏览器开发者工具
2. 检查控制台是否有错误信息
3. 检查网络请求是否正常

## 常见问题和解决方案

### 1. 子应用无法加载

**问题**: 主应用中显示子应用加载失败

**解决方案**:
1. 检查主应用中子应用的 entry 配置是否正确
2. 确认子应用已成功部署到 Vercel
3. 检查浏览器控制台是否有跨域错误
4. 确认子应用的 BASE_PATH 环境变量设置正确

### 2. 样式或资源加载失败

**问题**: 页面样式错乱或图片等资源无法加载

**解决方案**:
1. 检查 Vercel 配置中的路由规则
2. 确认 Vite 配置中的 base 路径设置正确
3. 检查构建输出目录是否正确

### 3. 路由无法正常工作

**问题**: 页面刷新后出现 404 错误

**解决方案**:
1. 检查 Vercel 配置中的路由重定向规则
2. 确认所有路由都正确重定向到 index.html

## 后续维护

1. **代码更新**: 推送到 main 分支会自动触发生产环境部署
2. **Pull Request**: 创建 PR 会自动创建预览部署
3. **环境变量更新**: 在 Vercel 控制台更新环境变量后需要重新部署
4. **依赖更新**: 更新依赖后需要重新部署以应用更改