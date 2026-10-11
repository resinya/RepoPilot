# RepoPilot 官方文档站

由 [Fumadocs](https://fumadocs.dev) + Next.js 16 驱动，**静态导出**部署到 GitHub Pages。

线上地址：<https://resinya.github.io/RepoPilot/>

## 技术栈

| 分类 | 选型 |
| --- | --- |
| 框架 | Next.js 16（App Router） |
| 文档框架 | Fumadocs Core / MDX / UI |
| 样式 | Tailwind CSS 4（配置写在 CSS 里） |
| 包管理 | pnpm 10 |

## 常用命令

```bash
pnpm dev        # 本地开发，http://localhost:3000
pnpm build      # 静态导出，产物在 out/
pnpm types:check
```

本地开发**不要**设 `PAGES=1`，否则会被加上 `/RepoPilot` 前缀。

## 改动优先级

| 想改什么 | 改哪里 |
| --- | --- |
| 站名、仓库地址、导航分类 | `src/lib/shared.ts` |
| 导航渲染方式 | `src/lib/layout.shared.tsx` |
| 文档内容 | `content/docs/` |
| 首页 | `src/app/(home)/page.tsx` |
| 构建与部署配置 | `next.config.mjs` |

## 部署相关的四个约束

1. **`output: 'export'`** —— Pages 没有 Node 运行时，必须静态导出
2. **`.nojekyll`** —— 不放这个文件，`_next/` 资源全部 404。CI 里已自动生成
3. **`basePath: '/RepoPilot'`** —— 站点在子路径下，仅 `PAGES=1` 时生效
4. **静态搜索** —— `/api/search` 用 `staticGET` 在构建期烘索引，客户端用 `useStaticSearch`。因为 Pages 上跑不了服务端搜索

## 一条硬性约束

**`content/docs/` 里不能出现真实的技能入口文件。** CLI 在标准位置找不到时会递归全仓库搜索，示例文件会被当成第二个技能装进用户机器。

要展示写法，用代码块：

````md
```yaml
---
name: repo-pilot
description: ...
---
```
````

仓库根的 `.github/workflows/validate-skill.yml` 已钉死这条规则。
