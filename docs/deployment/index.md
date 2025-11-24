# 部署指南

本指南将帮助您将微前端应用部署到不同的环境。

## 部署选项

- [部署概述](./overview.md) - 了解部署的基本概念和流程
- [Vercel 部署](./vercel.md) - 详细步骤指导如何部署到 Vercel 平台
- [Vercel 部署问题修复指南](./troubleshooting.md) - 解决 Vercel 部署过程中遇到的常见问题
- [主子应用独立部署](./independent.md) - 了解如何独立部署主应用和子应用
- [部署检查清单](./checklist.md) - 部署前的检查清单

## 选择合适的部署方案

根据您的需求和资源选择合适的部署方案：

1. **Vercel 部署**：适合快速部署和演示，提供免费额度
2. **独立部署**：适合生产环境，提供更高的自定义能力

选择最适合您项目需求的部署方案，并按照相应的指南进行操作.

## 部署架构

本项目采用微前端架构，包含一个主应用和多个子应用，它们可以独立部署到 Vercel。

### 部署策略

1. **独立部署**：主应用和子应用分别部署到不同的 Vercel 项目
2. **环境配置**：通过环境变量配置不同环境的参数
3. **路由映射**：通过主应用路由配置将子应用集成到主应用中

## 部署准备

### 1. Vercel 账户

确保您拥有 Vercel 账户，如果没有，请访问 [Vercel官网](https://vercel.com/) 注册。

### 2. GitHub 集成

将您的项目推送到 GitHub，并在 Vercel 中集成 GitHub 账户。

### 3. 项目创建

在 Vercel 中为每个应用创建独立的项目：

1. 主应用项目
2. 每个子应用项目

## 部署配置

### 1. 环境变量配置

在 Vercel 项目设置中配置必要的环境变量：

**主应用环境变量：**
- `VITE_SUB_APP_URL`: 子应用的部署地址 (例如: https://qiankun-vite-sub.vercel.app)

**子应用环境变量：**
- `BASE_PATH`: 子应用的基础路径，必须与主应用中配置的 `activeRule` 一致

为了安全和灵活性，建议将敏感配置信息通过 Vercel 的环境变量功能进行管理，而不是硬编码在代码中。这样可以避免将敏感信息提交到代码仓库中。

### 2. 构建配置

确保每个应用的 [package.json](/package.json) 中包含正确的构建脚本：

```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "pnpm install && pnpm build"
  }
}
```

### 3. Vercel 配置文件

每个应用根目录下需要包含 [vercel.json](/vercel.json) 配置文件：

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public,max-age=31536000,immutable"
      },
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 部署步骤

详细的部署步骤请参考以下文档：

- [部署概述](./overview.md): qiankun-vite 微前端项目的完整部署流程
- [Vercel 部署](./vercel.md): 详细介绍如何在 Vercel 上部署主应用和子应用
- [主子应用独立部署](./independent.md): 介绍主应用和子应用的独立部署配置