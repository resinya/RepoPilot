# 官方文档站（脚手架待接入）

本站复用 `D:/resinalgo` 的技术栈，而不是复用它的内容：

| 分类 | 选型 |
| --- | --- |
| 框架 | Next.js 16（App Router，Turbopack 构建） |
| 文档框架 | Fumadocs Core / MDX / UI |
| 样式 | Tailwind CSS 4（配置写在 CSS 里，无 config 文件） |
| 类型 | TypeScript |
| 代码规范 | Biome |
| 包管理 | pnpm |

## 接入步骤

从 `D:/resinalgo` 拷贝脚手架时，**只拷以下部分**（内容目录要换成 RepoPilot 自己的）：

```text
resinalgo/            →  RepoPilot/site/
├── package.json      →  package.json          # name 改为 repopilot-site
├── next.config.mjs   →  next.config.mjs
├── postcss.config.mjs→  postcss.config.mjs
├── biome.json        →  biome.json
├── tsconfig.json     →  tsconfig.json
├── src/              →  src/                   # 路由、llms.txt、OG 图
├── public/           →  public/                # 图片（大文件走 OSS）
└── content/docs/     →  content/docs/          # 内容换成 RepoPilot 文档
```

拷完后必改三处：

1. `package.json` 的 `name` → `repopilot-site`
2. `src/lib/shared.ts` 的站名、导航、`categories` 数组
3. `content/docs/meta.json` 的排序

## 硬性约束

**站内不得出现真实的 `SKILL.md` 文件。** CLI 在标准位置找不到 skill 时会递归全仓库搜索，文档里的示例文件会被误当成第二个 skill 装进用户机器。

要展示 SKILL.md 写法时，用以下两种形式之一：

- 放在 `.mdx` 里（扩展名不是 `SKILL.md`，不会被扫到）
- 写成带语言标注的代码块：

  ````md
  ```yaml
  ---
  name: repo-pilot
  description: ...
  ---
  ```
  ````

CI 已在 `.github/workflows/validate-skill.yml` 里钉死这条规则。

## 部署

站点构建产物走 GitHub Pages。`base` 路径必须等于仓库名：

```ts
// site/.vitepress 若改用 VitePress 则在此配置；Fumadocs 下对应 src/lib/shared.ts
base: '/RepoPilot/'
```

绑定自定义域名后改为 `/`，并在 `public/` 放 `CNAME`。
