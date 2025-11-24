# Vercel 部署问题修复指南

在将微前端项目部署到 Vercel 时，我们遇到了多个技术问题。本文档详细记录了问题的分析过程和解决方案，以帮助开发者快速解决类似问题。

## 问题概述

在部署过程中，我们遇到了以下主要问题：

1. **子应用样式丢失问题**
2. **Vercel 静态资源 404 错误**
3. **路由刷新后 URL 重写问题**
4. **文档站点部署失败**
5. **ESM 模块兼容性问题**
6. **文档站点死链接问题**
7. **MIME 类型错误**
8. **GitHub Actions 部署失败**
9. **Husky Git Hooks 配置问题**
10. **undici 包构建错误**

## 解决方案详解

### 1. 子应用样式隔离配置修复

**问题描述**：子应用样式在主应用中加载时丢失。

**解决方案**：
- 关闭 Qiankun 的实验性样式隔离配置
- 在子应用中添加微前端环境检测和样式类名

**相关文件修改**：
- `qiankun-vite-main/src/micro/index.ts`：关闭 experimentalStyleIsolation
- `qiankun-vite-sub/src/main.ts`：添加微前端环境检测
- `qiankun-vite-sub/src/styles/index.scss`：添加微前端容器样式

### 2. Vercel 路由配置修复

**问题描述**：静态资源返回 404 错误。

**解决方案**：
- 修正主应用和子应用的 Vercel 路由配置
- 正确映射静态资源路径

**相关文件修改**：
- `qiankun-vite-main/vercel.json`：修正静态资源代理路径
- `qiankun-vite-sub/vercel.json`：修正路由规则处理静态资源

### 3. 路由刷新问题修复

**问题描述**：刷新页面后 URL 被错误重写。

**解决方案**：
- 调整 Vercel 配置确保路由能被主应用正确处理

**相关文件修改**：
- `qiankun-vite-main/vercel.json`：优化路由规则

### 4. 文档站点部署配置

**问题描述**：文档站点部署失败，访问到主应用内容。

**解决方案**：
- 为文档站点创建独立的 Vercel 配置
- 正确设置根目录和构建输出目录

**相关文件修改**：
- `qiankun-vite-main/docs/vercel.json`：创建文档站点 Vercel 配置
- `qiankun-vite-sub/docs/vercel.json`：创建子应用文档站点配置

### 5. ESM 模块兼容性修复

**问题描述**：VitePress 作为 ESM-only 包不能通过 require 加载。

**解决方案**：
- 在 package.json 中添加 "type": "module" 配置

**相关文件修改**：
- `qiankun-vite-main/docs/package.json`：添加 ESM 模块声明
- `qiankun-vite-sub/docs/package.json`：添加 ESM 模块声明

### 6. 文档站点死链接修复

**问题描述**：文档中引用项目文件时使用了不正确的相对路径。

**解决方案**：
- 修正所有文档中的链接路径
- 配置忽略死链接检查

**相关文件修改**：
- `qiankun-vite-main/docs/.vitepress/config.ts`：添加忽略死链接配置
- 多个文档文件：修正死链接路径

### 7. MIME 类型错误修复

**问题描述**：JavaScript 文件被当作 HTML 返回，浏览器拒绝加载。

**解决方案**：
- 优化 Vercel 路由配置，确保静态资源正确返回

**相关文件修改**：
- `qiankun-vite-main/docs/vercel.json`：添加精确的路由规则
- `qiankun-vite-sub/docs/vercel.json`：添加精确的路由规则

### 8. GitHub Actions 部署配置修复

**问题描述**：使用了 Vercel CLI 不支持的参数。

**解决方案**：
- 移除不支持的 `--dir` 参数
- 使用环境变量指定部署目录

**相关文件修改**：
- `qiankun-vite-main/.github/workflows/deploy-vercel.yml`：修复 GitHub Actions 配置
- `qiankun-vite-sub/.github/workflows/deploy-vercel.yml`：修复 GitHub Actions 配置

### 9. Husky Git Hooks 配置修复

**问题描述**：Husky 钩子没有设置为可执行文件。

**解决方案**：
- 为 Husky 钩子文件添加可执行权限
- 添加 lint-staged 配置

**相关文件修改**：
- `qiankun-vite-sub/package.json`：添加 lint-staged 配置

### 10. undici 包构建错误修复

**问题描述**：undici 包在 Node.js 环境中尝试使用 Web API 导致构建失败。

**解决方案**：
- 创建 undici 垫片文件
- 更新 Vite 配置中的别名

**相关文件修改**：
- `qiankun-vite-sub/vite.config.ts`：添加 undici 别名
- `qiankun-vite-sub/undici-shim.js`：创建 undici 垫片文件

## 部署验证

所有问题修复后，项目已成功部署到 Vercel：
- 主应用：https://qiankun-vite-main.vercel.app/
- 子应用：https://qiankun-vite-sub.vercel.app/
- 主应用文档：https://qiankun-vite-main-docs.vercel.app/
- 子应用文档：https://qiankun-vite-sub-docs.vercel.app/

## 后续建议

1. 定期检查依赖包的兼容性
2. 保持 Vercel CLI 和相关工具的更新
3. 完善 CI/CD 流程的错误处理机制
4. 持续监控部署状态和性能指标