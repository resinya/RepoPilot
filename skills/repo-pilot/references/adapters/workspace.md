# 工作区与工程规则

用于包关系、运行目录和规范，工具配置不等于业务架构。

| 线索 | 确认 |
| --- | --- |
| npm/yarn workspaces、pnpm-workspace.yaml | 实际成员、包名、本地依赖；清单目录不等于应用 |
| turbo.json、nx.json | 任务配置；任务依赖不等于 API 调用 |
| Maven modules/parent、Gradle settings | 构建/继承边界；继承未必运行依赖 |
| go.work、go.mod replace | 成员/本地模块；多个 main 分别定位 |
| CI、Docker/Compose、代理 | 文档化运行/发布与外部依赖；未运行须说明 |

声明关系与源码 import 单独确认。别名无法解析保留线索，不合并同名包。Git 只读，不运行 hooks/外部 diff。

嵌套仓库/submodule/链接成员标边界，明确范围再探索。规范取贡献指南、格式/测试配置、脚本和 CI，区分强制规则与习惯。
