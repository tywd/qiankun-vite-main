# 部署概述

本项目支持多种部署方式，包括Vercel部署、独立部署等。

## 部署架构

项目采用微前端架构，包含主应用和子应用两部分，可以独立部署也可以联合部署。

## Vercel部署

Vercel部署是最推荐的部署方式，具有以下优势：

1. **自动化部署**：通过GitHub Actions实现自动化部署
2. **全球CDN**：提供全球加速访问
3. **免费额度**：提供充足的免费额度
4. **简单配置**：配置简单，易于维护

### 部署配置

在主应用的 [/src/utils/index.ts](../../src/utils/index.ts) 文件中，将子应用的entry配置更新为实际的Vercel部署地址：

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

## 独立部署

项目也支持独立部署，详细配置请参考[主子应用独立部署](/deployment/independent)文档。

## 环境变量配置

不同环境需要配置不同的环境变量，确保应用正常运行。

### 主应用环境变量

```bash
VITE_SUB_APP_URL=https://your-sub-app.vercel.app
```

### 子应用环境变量

```bash
BASE_PATH=/sub-app
```

## 部署验证

部署完成后，需要验证以下内容：

1. 主应用能否正常访问
2. 子应用能否正常加载
3. 路由是否正常工作
4. 样式是否正常显示
5. 通信功能是否正常

## 常见问题

1. **子应用无法加载**：检查子应用的entry配置是否正确
2. **样式丢失**：检查Vercel的路由配置是否正确
3. **路由404**：检查路由重定向配置是否正确
4. **通信失败**：检查环境变量配置是否正确

## 后续维护

1. 代码更新后自动触发重新部署
2. 环境变量更新后需要手动重新部署
3. 依赖更新后需要重新部署
