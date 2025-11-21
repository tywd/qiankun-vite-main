# Qiankun Vite 微前端项目文档

欢迎来到基于 Vite 和 Qiankun 的微前端解决方案文档站点。

## 项目概述

本项目是一个基于 Vite 构建的微前端架构示例，使用 Qiankun 作为微前端框架，实现了主应用与子应用的集成。

自用的微前端解决方案，一个主应用基座，可以理解为一个壳应用，基于 Qiankun + Vue3 + Vite + TypeScript 构建的微前端解决方案。用于学习Vite、Qiankun从0开发搭建一个项目（自身学习使用）

### 技术栈

- 主应用：Vue 3 + Vite + TypeScript
- 子应用：Vue 3 + Vite + TypeScript
- 微前端框架：Qiankun
- 构建工具：Vite
- 包管理：PNPM

## 文档导航

- [主应用详解](./main-app/): 详细介绍主应用的架构、路由配置、生命周期管理等内容
- [子应用接入](./sub-app/): 说明如何将子应用接入到主应用中
- [部署指南](./deployment/): 详细介绍如何将主应用和子应用部署到 Vercel
- [部署检查清单](./deployment/checklist.md): 部署时的参考流程清单

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动主应用
cd qiankun-vite-main
pnpm dev

# 启动子应用
cd qiankun-vite-sub
pnpm dev
```

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助我们改进这个项目。