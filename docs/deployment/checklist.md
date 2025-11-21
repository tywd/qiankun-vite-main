# 微前端主子应用部署检查清单

## 前置准备
- [ ] 确认主应用和子应用代码已推送到 GitHub 仓库
- [ ] 确认主应用和子应用分别在 Vercel 上创建了项目
- [ ] 确认已获取 Vercel 的访问令牌和项目 ID

## 环境变量配置

### 主应用环境变量 (Vercel)
- [ ] `VITE_SUB_APP_URL` - 子应用的部署地址
- [ ] `VERCEL_TOKEN` - Vercel 访问令牌
- [ ] `VERCEL_ORG_ID` - Vercel 组织 ID
- [ ] `VERCEL_PROJECT_ID` - 主应用项目 ID

### 子应用环境变量 (Vercel)
- [ ] `BASE_PATH` - 子应用的基础路径 (通常为 `/sub-app`)
- [ ] `VERCEL_TOKEN` - Vercel 访问令牌
- [ ] `VERCEL_ORG_ID` - Vercel 组织 ID
- [ ] `VERCEL_PROJECT_ID` - 子应用项目 ID

## 配置文件检查

### 主应用配置
- [ ] `vercel.json` 路由规则正确配置
- [ ] `src/utils/index.ts` 中子应用配置正确
- [ ] 环境变量文件配置正确 (`.env`, `.env.development`, `.env.production`)

### 子应用配置
- [ ] `vercel.json` 路由规则正确配置
- [ ] `vite.config.ts` 基础路径配置正确
- [ ] 环境变量文件配置正确 (`.env`, `.env.development`, `.env.production`)

## 部署流程

### 1. 主应用部署
- [ ] 推送代码到主应用 GitHub 仓库
- [ ] 触发 GitHub Actions 自动部署
- [ ] 检查 Vercel 部署日志
- [ ] 验证主应用是否能正常访问

### 2. 子应用部署
- [ ] 推送代码到子应用 GitHub 仓库
- [ ] 触发 GitHub Actions 自动部署
- [ ] 检查 Vercel 部署日志
- [ ] 验证子应用是否能独立访问

### 3. 集成验证
- [ ] 通过主应用访问子应用
- [ ] 验证子应用资源加载是否正常 (Content-Type 应为 application/javascript)
- [ ] 验证子应用样式是否正常显示
- [ ] 验证主子应用间通信是否正常

## 常见问题排查

### 资源加载问题
- [ ] 检查 `vercel.json` 中的路由代理配置
- [ ] 确认子应用 `BASE_PATH` 环境变量配置正确
- [ ] 验证子应用资源返回的 Content-Type 是否正确

### 样式丢失问题
- [ ] 检查子应用组件是否使用了 `scoped` 样式
- [ ] 确认主应用微前端配置中的样式隔离设置
- [ ] 验证子应用样式文件是否正确引入

### 环境变量问题
- [ ] 确认敏感信息未提交到代码仓库
- [ ] 验证 Vercel 环境变量配置是否正确
- [ ] 检查本地开发环境变量配置