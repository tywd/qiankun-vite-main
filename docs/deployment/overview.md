# 部署概述

本指南将详细介绍如何将 qiankun-vite 微前端项目（包括主应用和子应用）部署到 Vercel 的完整流程。

## 项目结构

```
project-root/
├── qiankun-vite-main/      # 主应用
│   ├── .github/workflows/  # GitHub Actions 配置
│   ├── src/               # 源代码
│   ├── package.json       # 项目配置
│   ├── vite.config.ts     # Vite 配置
│   ├── vercel.json        # Vercel 配置
│   └── DEPLOYMENT.md      # 部署说明
├── qiankun-vite-sub/       # 子应用
│   ├── .github/workflows/  # GitHub Actions 配置
│   ├── src/               # 源代码
│   ├── package.json       # 项目配置
│   ├── vite.config.ts     # Vite 配置
│   ├── vercel.json        # Vercel 配置
│   └── DEPLOYMENT.md      # 部署说明
└── DEPLOYMENT_SUMMARY.md  # 本文件
```

## 部署流程概览

### 1. 准备工作

1. 确保主应用和子应用都已推送到 GitHub 仓库
2. 在 Vercel 上创建两个项目（一个用于主应用，一个用于子应用）
3. 获取 Vercel 访问令牌和项目标识

### 2. 配置 GitHub Secrets

在主应用的 GitHub 仓库中设置以下 Secrets：
- `VERCEL_TOKEN`: Vercel 访问令牌
- `VERCEL_ORG_ID`: Vercel 组织 ID
- `VERCEL_PROJECT_ID`: 主应用的 Vercel 项目 ID
- `VERCEL_SUB_PROJECT_ID`: 子应用的 Vercel 项目 ID

### 3. 配置 Vercel 环境变量

在子应用的 Vercel 项目设置中添加环境变量：
- `BASE_PATH`: /qiankun-vite-sub （必须与主应用中配置的 activeRule 保持一致）

### 4. 更新主应用中的子应用配置

在主应用的 [/src/utils/index.ts](/src/utils/index.ts) 文件中，将子应用的 entry 配置更新为实际的 Vercel 部署地址：

```typescript
export const getSubApp = () => {
    // 在生产环境中使用 Vercel 部署地址，开发环境中使用本地地址
    const isProd = process.env.NODE_ENV === 'production';
    const subAppEntry = isProd 
        ? 'https://your-actual-sub-app.vercel.app' // 替换为实际的 Vercel 部署地址
        : 'http://localhost:8082';

    return [
        {
            name: '子应用', // 子应用名称
            entry: subAppEntry, // 子应用入口
            container: '#micro-app-container', // 挂载容器
            activeRule: '/qiankun-vite-sub', // 激活路由
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

### 5. 部署过程

GitHub Actions 工作流会自动处理以下步骤：
1. 检出代码
2. 设置 Node.js 环境
3. 安装 pnpm
4. 安装项目依赖
5. 构建项目
6. 部署到 Vercel

### 6. 验证部署

1. 访问主应用的 Vercel 部署地址
2. 导航到子应用的路由（/qiankun-vite-sub）
3. 验证子应用是否正确加载和显示

## 关键配置文件

### 主应用关键配置

1. **GitHub Actions**: [.github/workflows/deploy-vercel.yml](/.github/workflows/deploy-vercel.yml)
   - 配置了主应用和子应用的并行部署
   - 使用 Secrets 进行身份验证

2. **Vercel 配置**: [vercel.json](/vercel.json)
   - 配置了静态文件构建和路由规则

3. **Vite 配置**: [vite.config.ts](/vite.config.ts)
   - 配置了构建输出目录和资源目录

### 子应用关键配置

1. **GitHub Actions**: [.github/workflows/deploy-vercel.yml](/.github/workflows/deploy-vercel.yml)
   - 配置了子应用的独立部署流程

2. **Vercel 配置**: [vercel.json](/vercel.json)
   - 配置了静态文件构建和路由规则

3. **Vite 配置**: [vite.config.ts](/vite.config.ts)
   - 配置了基础路径，确保在 Vercel 上正确部署

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

## 参考文档

- [Vercel 部署](./vercel.md): 详细介绍如何在 Vercel 上部署主应用和子应用
- [主子应用独立部署](./independent.md): 介绍主应用和子应用的独立部署配置
- [Vercel 官方文档](https://vercel.com/docs)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)