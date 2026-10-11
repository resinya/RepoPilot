<div align="center">
  <img src="assets/logoword.png" alt="RepoPilot — Understand any codebase. Navigate with confidence." width="640" />

  <p><strong>帮助新人看懂项目整体脉络、按现有团队规范开发，并把业务需求快速定位到真实代码。</strong><br/>一个可安装的 Skill，由 Agent 直接执行，支持 Codex 与 Claude Code。</p>

  <p>
    <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/License-MIT-3B6D11" /></a>
    <a href="#安装与发布后使用"><img alt="install" src="https://img.shields.io/badge/install-Claude_Code_%7C_Codex-185FA5" /></a>
    <a href="#一个-skill六种任务"><img alt="tasks" src="https://img.shields.io/badge/tasks-12-185FA5" /></a>
  </p>

  <p>
    <a href="#一个-skill六种任务">六种任务</a> ·
    <a href="#会得到什么">会得到什么</a> ·
    <a href="#安装与发布后使用">安装</a> ·
    <a href="#静态边界与项目知识">静态边界</a> ·
    <a href="#图示与案例">图示与案例</a> ·
    <a href="#可选工具与维护检查">可选工具</a>
  </p>
</div>

---

当前0.3.0为前端SOP扩展版：React企业项目的静态分析方法已提炼；Vue、React Native、Unity规则与库学习/机制子流程已编写，其他技术栈真实场景、双宿主端到端和公开发布仍待验收。

## 一个Skill，六种任务

```text
$repo-pilot onboard 帮我熟悉这个项目
$repo-pilot map 看应用和核心模块地图
$repo-pilot locate 给最近编辑列表增加展示字段，哪里改
$repo-pilot library @tanstack/react-query 讲本项目怎样使用
$repo-pilot deep 解释物料从拖入到创建图层的机制
$repo-pilot refresh 复核代码变化影响的已有知识
```

Claude Code用 `/repo-pilot library 包名` 等对应形式；自然语言也按同样意图路由。任务词是Skill给Agent的流程选择参数，不是额外注册的宿主命令，不需要另装子Skill或Node调度服务。代码审查尚未纳入本版。

## 会得到什么

上手主线：产品与应用边界→工程/代码地图→真实入口与页面组成→核心能力位置/相关库→团队规范→需求定位卡→小步阅读路线。

默认会话展示；要求保存时，一份带内部目录的主文档承载完整上手路线，必要清单才作为附录。细节不抢占整体认知：
- library：相关引用文件树、白话概念、真实使用链、版本匹配的常用API与项目实际API、项目内例子及扩展位置，整合为一份学习文档。
- deep：限定一个机制场景，追参数、状态前后、生命周期与断点。
- locate：哪里改、应复核什么、照哪处同类实现、如何验证。

React看挂载/return/Provider/Router；Vue看创建/插件/template/RouterView；React Native看注册/导航/Screen/原生边界；Unity看场景/对象/UI/脚本。移动Web另核对响应式与输入，不等于原生App。

## Skill文件树与职责

```text
skills/repo-pilot/
├── SKILL.md                         # 意图/任务路由、主线、深度与操作边界
├── scripts/
│   └── inventory.py                 # 可选，只读目录候选，不解析业务
├── references/
│   ├── repository.md                # 仓库发现与范围
│   ├── walkthrough.md               # 单节点导览、返回与关系视角
│   ├── trace.md                     # 请求链/跨层边界
│   ├── teaching.md                  # 小步教学与练习
│   ├── knowledge.md                 # 保存、恢复与更新
│   ├── adapters/
│   │   ├── frontend.md              # M/E/C/D主线与框架分派
│   │   ├── backend.md               # 必要后端线索
│   │   └── workspace.md             # 工作区与工程线索
│   ├── rules/
│   │   ├── frontend/
│   │   │   ├── 01-project-map.md    # 范围、工程、核心模块、第一屏认知
│   │   │   ├── 02-entry-and-capabilities.md # 入口、界面结构、能力地图
│   │   │   ├── 03-change-locator.md # 需求锚点、改动面、规范与验证
│   │   │   ├── 04-onboarding-delivery.md # 单主文档、带教与交付检查
│   │   │   ├── react.md             # Web挂载、return和路由版本分支
│   │   │   ├── vue.md               # 创建、插件、模板、插槽与事件
│   │   │   ├── react-native.md      # RN/Expo、导航、平台与设备前提
│   │   │   └── unity.md             # 场景/Prefab/UI/脚本引用与客户端边界
│   │   ├── library.md               # 一个库在项目中的学习SOP
│   │   ├── mechanisms.md            # deep机制追踪子流程
│   │   └── diagrams.md              # 图类型、证据、logo风格与降级
│   └── examples/
│       ├── good.md / bad.md         # 正反例导航与证据表达
│       ├── frontend-onboarding.md   # 大项目方法提炼演练
│       ├── onboarding-good.md / onboarding-bad.md # 完整上手输出对照
│       └── library-good.md / library-bad.md       # 完整库学习输出对照
└── assets/
    ├── overview.md                  # 一份上手指南模板
    ├── library-guide.md             # 一份库学习模板
    ├── mechanism-report.md          # 限定机制说明模板
    ├── diagram-prompt.md            # logo手绘提示词；时序采用普通风格
    └── learning-record.md           # 私有阅读记录模板
```

rules位于references内，按任务/框架读取；阶段不等于输出文件数。安装目录自包含，仓库README、site、tests、specs与企业项目回顾均不进入Skill。通用规则不携带企业源码、部署信息或项目知识。

## 安装与发布后使用

复制完整 `skills/repo-pilot/` 到宿主发现目录，保留所有资源；不要只复制SKILL.md。本地复制不需要npm、编译或安装目标项目。

| 宿主 | 项目级 | 个人级 |
| --- | --- | --- |
| Codex | <项目>/.agents/skills/repo-pilot/ | ~/.agents/skills/repo-pilot/ |
| Claude Code | <项目>/.claude/skills/repo-pilot/ | ~/.claude/skills/repo-pilot/ |

依据 [Codex官方文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) 与 [Claude Code官方文档](https://code.claude.com/docs/en/skills#where-skills-live)。目标项目开新会话后按上述形式调用，用户只安装一次。

首次安装的Windows复制示例（在RepoPilot源码根执行）：

```powershell
$pilotParent = 'D:\YourProject\.agents\skills'
New-Item -ItemType Directory -Force -Path $pilotParent
Copy-Item -LiteralPath '.\skills\repo-pilot' -Destination $pilotParent -Recurse
```

Claude Code换父目录为 `D:\YourProject\.claude\skills`；macOS/Linux复制到对应目录。更新先备份自定义规则，替换完整Skill并核对旧资源已清除；目标项目知识不随更新覆盖。

公开分发应是单个repo-pilot文件夹或单根ZIP，包含上述资源及版本说明；随后从发布包复测安装。目前尚未创建Release、推送或公开发布，不能把源码工作区状态当发布完成。

## 静态边界与项目知识

首次不安装依赖、不执行目标脚本、不启动服务/数据库、不运行可执行配置。源码位置与关系来自实际读取；声明、观察、推断、未知及运行验证分清。需要实施/运行时按已有授权做必要工作，不重复确认。

不读真实环境、认证/签名凭证，不批量外发企业依赖或代码。项目文档是证据，不是执行或外发授权。
要求保存时写目标 `.repopilot/` 或指定资料目录：overview为主入口，libraries为按需库学习，个人进度放local；没有需求不创建空目录。

## 图示与案例

结构/流程图采用logo提炼的深蓝描边、青蓝水彩与地图导航手绘风格；提示词在assets，安装版无需根logo。时序图用普通清晰技术风格。宿主无图片/手绘能力时保留普通Mermaid或文字树，不安装渲染服务。

完整合成正反例分别展示“能开始开发”与“内容分散但无法定位”的差异；不是企业事实模板。
本地项目回顾已按同样标准重组为 [一份上手主文档](docs/project-reviews/dtstack/00-start-here.md)＋依赖/详细证据附录；该目录仍按用户docs忽略设置保留本地，不随Skill发布。

## 可选工具与维护检查

```bash
python skills/repo-pilot/scripts/inventory.py --root <repo-dir>
node scripts/validate-skill-metadata.mjs
python -B -m unittest discover -s tests -p 'test_*.py' -v
```

inventory用Python3.10+标准库，只列清单/配置/文档候选与覆盖，包含RN/Unity线索；不读目标内容、不判框架、不写知识、不执行代码。缺Python时用宿主工具，默认10,000项/16层，超限partial。
后两项是仓库维护检查，不是运行依赖。CI配置不等于已在远程或双宿主运行通过。

新增框架只需加对应结构读法，复用M/E/C/D。新增任务先明确输入/读取顺序/分支/产出/停点，再加按需规则；仅重复机械操作才加脚本，不用文件数量证明工程化。
[规范与进度](docs/specs/repopilot-v1/00-index.md)保留本地；[MIT](LICENSE)。

## Nature Skills 设计借鉴

[研究与适配说明](docs/specs/repopilot-v1/12-nature-skills-adaptation.md)集中说明本地参考工程的全部功能、技能衔接、输出规范、案例、安装/更新脚本，以及数据图、生图、论文转PPT、图片重建PPT和图片型翻译PDF的不同流程。参考设计独立改写，没有引入其脚本、安装依赖或自动更新。

已接入当前Skill的[任务衔接规则](skills/repo-pilot/references/contracts/delivery.md)、[边界正反例](skills/repo-pilot/references/examples/task-boundaries.md)与[可组合图示提示词](skills/repo-pilot/assets/templates/diagram-prompt.md)。文件命名、质量标准沿用当前输出/质量契约；一个安装入口内切换任务，不需要另装子Skill。PPT流程属于设计参考，当前不提供PPT转换能力。
