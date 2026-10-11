# 完整合成例：Web与API工作区

这是一组给定的合成输入/输出，不是企业项目事实。正式任务必须替换成实读位置。示意输入：工作区成员apps/web和apps/api；清单分别声明React ^18.2.0、Express ^4.21.0；根TypeScript ~5.7.0。Web入口main.tsx调用Orders，Orders通过原生fetch请求/orders；API main.ts注册/orders、调用service再读取内存store。无锁文件、部署、持久化证据。

## 调用与产物

`$repo-pilot onboard 熟悉订单项目，保存到 docs/project-knowledge/orders`

```text
docs/project-knowledge/orders/
├── 00-start-here.md
├── 01-architecture.md
└── 02-tech-stack.md
```

没有全量依赖/深机制/导出图需求，不生成这些文件。下面是三份完整的简短内容示例。

## 文件一：00-start-here.md

# Orders上手入口

> ★ 必读；范围：Web与API；静态读取，未运行。

### ★ 产品

浏览器展示订单列表，API提供列表数据。本次只看这一条主线。

### ★ 架构

| 维度 | 结论与证据状态 |
| --- | --- |
| 工程组织 | 已确认静态：根workspace管理两个成员，package.json |
| 运行边界 | Web挂载＋API监听两个入口；部署连接未知，main.tsx/main.ts |
| 代码组织 | API路由→service→store，Web页面→api封装；只确认已读列表模块 |
| 数据协作 | API数据来自内存数组；Web本地state消费fetch结果；实际跨端连通未验证 |

### ★ 核心技术

React声明^18.2.0负责UI和本地状态；Express声明^4.21.0负责接口注册；原生Fetch负责请求；TypeScript声明~5.7.0负责工程检查。均未解析锁定/安装版本。用途依据实际入口/消费者，不由声明推全仓使用。

### ★ 重要位置和开始顺序

| 步骤 | 位置 | 读后答案 | 下一步 |
| --- | --- | --- | --- |
| 1 | apps/web/src/main.tsx→Orders.tsx | UI入口、state与取数时机 | api.ts |
| 2 | apps/web/src/api.ts | 请求路径、失败与返回 | API注册 |
| 3 | apps/api/src/main.ts→service.ts→store.ts | 路由、业务、内存数据分工 | 形成需求卡 |

三个重要位置分别是Web入口/页面、请求封装、API业务路径；正式输出附实读行号。

### ◆ 未确认

部署如何将Web请求送到API未知，下一证据是代理/部署定义；无数据库证据，不补数据库架构。测试/脚本仅文本检查。

### ○ 产物与来源

架构详情在同目录01-architecture.md，技术角色表在02-tech-stack.md。来源：合成示例演示repo-pilot 0.4.0 onboard；示例日期2026-10-11，revision不可得；正式产出应记录实际日期/源码状态。未安装/启动，已读范围是给定清单与列表路径。

## 文件二：01-architecture.md

# Orders架构

> ★ 摘要必读；任务architecture；合成静态输入；来源00-start-here。

| 维度 | 结论 | 依据 | 未知 |
| --- | --- | --- | --- |
| 工程 | 一个工作区管理两个成员 | 根workspaces | 不证明独立部署 |
| 运行 | 浏览器挂载和API监听 | 两个main入口 | 请求实际送达/部署数量 |
| 代码 | 按列表功能组织，API路径内分层 | route→service→store | 其他功能未给定 |
| 数据 | 内存数组→服务返回→接口；页面state保存结果 | store/listOrders/Orders | 无持久化证据 |

| 模块 | 职责 | 重要位置 |
| --- | --- | --- |
| Web | 挂载、列表展示、取数 | main.tsx、Orders.tsx、api.ts |
| API | 注册、业务查询、数据来源 | main.ts、service.ts、store.ts |

典型路径：Orders的effect→Web listOrders→fetch/orders→部署映射未知；API /orders→service.listOrders→内存store。两个局部路径分别静态确认，不画实测端到端箭头。

下一证据：部署/代理定义；若需持久化解释，需数据访问实现。不是因为有两个应用就认定微服务。

## 文件三：02-tech-stack.md

# Orders技术栈

> ★ 核心摘要；任务stack；合成静态输入；来源00-start-here。

| 技术角色 | 技术/应用 | 声明/锁定 | 用途 | 重要性理由 | 代表来源 |
| --- | --- | --- | --- | --- | --- |
| UI/本地状态 | React/Web | ^18.2.0/未解析 | 挂载与列表state | 核心：列表界面 | web清单/main/Orders |
| HTTP接口 | Express/API | ^4.21.0/未解析 | 路由注册与监听 | 核心：列表入口 | api清单/main |
| 网络 | 原生Fetch/Web | 浏览器运行版本未知 | 发请求并解响应 | 核心：数据来源 | api.ts |
| 数据 | 项目内存数组/API | 不适用第三方版 | 列表数据 | 核心：实际数据归属 | store.ts |
| 工程 | TypeScript/根 | ~5.7.0/未解析 | check脚本 | 重要：工程检查 | 根清单 |

数据库/消息队列：本轮未见实际使用，不补造。第三方声明和运行版本分开；完整依赖表不是必读任务。

## 验收说明

首屏架构、核心技术、重要位置和步骤自足；01/02独立回答详情，来源/未知清楚。真实生成须用可点击的实际文档链接和实读文件行号，不能将本示例的符号当目标事实。
