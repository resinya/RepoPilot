<div align="center">
  <img src="assets/logoword.png" alt="RepoPilot — Understand any codebase. Navigate with confidence." width="640" />

  <p><strong>帮助新人看懂项目整体脉络、按现有团队规范开发，并把业务需求快速定位到真实代码。</strong><br/>一个可安装的 Skill，由 Agent 直接执行，支持 Codex 与 Claude Code。</p>

  <p>
    <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/License-MIT-3B6D11" /></a>
    <a href="#安装与发布后使用"><img alt="install" src="https://img.shields.io/badge/install-Claude_Code_%7C_Codex-185FA5" /></a>
    <a href="#一个-skill按目标选择任务"><img alt="tasks" src="https://img.shields.io/badge/tasks-14-185FA5" /></a>
  </p>

  <p>
    <a href="#一个-skill按目标选择任务">任务与用法</a> ·
    <a href="#会得到什么">会得到什么</a> ·
    <a href="#安装与发布后使用">安装</a> ·
    <a href="#静态边界与项目知识">静态边界</a> ·
    <a href="#图示与案例">图示与案例</a> ·
    <a href="#可选工具与维护检查">可选工具</a> ·
    <a href="https://resinya.github.io/RepoPilot/">在线文档</a>
  </p>
</div>

---

当前 **0.5.0** 把项目理解串成一条学习链路：**整体认知 → 业务模块 → 请求与数据变化 → 小步源码导览 → 开发需求定位**。默认集中展示；保存时以一份带内部目录的主文为入口；可视化以一页完整场景为默认，点击只作辅助。

## 一个 Skill，按目标选择任务

```text
$repo-pilot onboard 帮我熟悉这个项目
$repo-pilot business 先讲这个应用的业务框架和模块分工
$repo-pilot trace 解释登录请求每一步传什么、变成什么
$repo-pilot walkthrough 文件太大了，每轮只讲一个小问题
$repo-pilot visualize 把这个业务放在一个页面展示，不要一直点来点去
$repo-pilot locate 给列表加一个字段，应该改哪里、参照哪里
$repo-pilot library @tanstack/react-query 讲当前应用的真实用法
```

还支持 map、architecture、stack、standards、deep、teach、refresh。一个安装目录内按目标切换资料，不用另装子 Skill。说“继续”沿当前问题推进；“配置知道了、跳过”回业务主线；“返回”按真实阅读历史恢复。

独立安装到 Claude Code 时用 `/repo-pilot`；插件安装用 `/repo-pilot:repo-pilot`。任务词是给 Agent 的意图参数，自然语言同样有效。

## 会得到什么

首先说明项目用途、业务模块、架构与技术职责、重要位置和阅读路线。之后用一个真实动作讲清：
**谁发出什么输入 → 哪个模块如何处理 → 数据变成什么 → 交给谁**。
目录、函数名和包名只作定位，不能替代解释。

- 业务学习：先认模块，再选代表场景；不一开始粘贴整文件。
- 源码带读：Agent 读够证据，每轮展示一个问题所需的小切片。
- 项目开发：规范、同类实现、需求拟改位置与验证前提一起给。
- 单库学习：引用树、白话概念、实际使用链与项目 API 在一份指南中。
- 可视化：一个真实/模拟案例贯穿完整时序图，固定参与者明确谁传给谁；按大阶段集中展示URL、header、对象样子、字段来源与结果，导航只定位，补充证据可展开。

React、Vue、React Native、Unity、服务端、库/CLI 和数据任务分别沿真实入口适配；混合仓库按应用区别，不用目录名替代判断。框架覆盖规则已经编写，未测样本与运行事实如实标明。

## Skill 文件树与职责

```text
skills/repo-pilot/
├── SKILL.md                      # 目标、任务路由、学习链路和操作边界
├── references/
│   ├── workflows/                # onboard/business/trace/walkthrough/visualize 等SOP
│   ├── adapters/                 # 按项目类型与框架决定如何读取
│   ├── contracts/                # 证据、集中输出、讲解、质量与衔接
│   └── examples/                 # 业务学习、集中地图、库学习等完整正反例
├── assets/templates/
│   ├── overview.md               # 一份完整上手主文
│   ├── business-map.html         # 无依赖、可离线的单页业务地图
│   └── ...                       # 各任务按需输出模板
├── scripts/inventory.py          # 可选只读目录候选扫描
└── evals/                        # 合成项目与行为评估用例
```

Skill 的资料按需加载；项目知识属于目标项目，不写回 Skill。项目的阅读输出集中，不等于把所有条件分析规则塞入一个 SKILL.md。宿主直接执行指令，没有中间调度服务。

## 安装与发布后使用

Claude Code 可通过 GitHub Marketplace 安装：

```bash
claude plugin marketplace add resinya/RepoPilot
claude plugin install repo-pilot@repo-pilot --scope user
```

重新开会话后输入 `/repo-pilot:repo-pilot 帮我熟悉这个项目`。这些命令取得远程已提交版本；本次本地改动需发布后才会被获取。

也可以复制完整 `skills/repo-pilot/` 到宿主发现目录，不要只复制 SKILL.md：

| 宿主 | 项目级 | 个人级 |
| --- | --- | --- |
| Codex | `.agents/skills/repo-pilot/` | `~/.agents/skills/repo-pilot/` |
| Claude Code | `.claude/skills/repo-pilot/` | `~/.claude/skills/repo-pilot/` |

目标项目开新会话后调用；更新时备份自定义规则、替换完整 Skill，项目知识保留。

## 静态边界与项目知识

首次静态读取，不安装目标依赖、不执行项目脚本、不启动服务/数据库或运行可执行配置；后续执行按用户已有授权处理。源码声明、静态观察、推断、未知与实际运行区分。

不读真实环境、认证凭证或私钥，不发送企业源码到公共服务。网页仅展示本地分析内容，不自动请求目标接口；页面测试不等于业务运行验证。

默认会话展示，要求保存时以目标 `.repopilot/00-start-here.md` 整合全貌、业务、架构、技术和开发路线；独立专题或业务地图仅按需增加。现有笔记先读后更新，个人进度放 local，不把每阶段拆成一个文件。

## 图示与案例

默认清晰文字树、Mermaid 或单页业务地图。用户提供参考图时用参考图；指定 logo 风格时使用深蓝描边、青蓝水彩和地图导航提示词；时序图保持清晰。主场景内容直接可读，不强制逐层点击。

[业务学习正反例](skills/repo-pilot/references/examples/business-learning.md)展示先业务、小切片和跳过配置；
[集中地图正反例](skills/repo-pilot/references/examples/interactive-map.md)展示一页完整流程，以及多文档、逐步点选和只有箭头的坏输出。案例是合成演练，不包含企业项目事实。

## 可选工具与维护检查

```bash
node scripts/validate-skill-metadata.mjs
python -B -m unittest discover -s tests -p 'test_*.py' -v
claude plugin validate .
python skills/repo-pilot/scripts/inventory.py --root <repo-dir>
```

inventory 用 Python 3.10+ 标准库，只列目录候选与覆盖，不读业务内容、不写知识、不执行目标代码；缺 Python 用宿主搜索。仓库维护检查、页面交互和真实项目行为评估分别记录。

新增适配器复用学习主线；重复且确定的操作才加脚本。遵循 [MIT](LICENSE)。
