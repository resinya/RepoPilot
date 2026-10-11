# 完整合成例：CLI小项目合并交付

给定合成输入：package.json的bin=text-export→bin/export.cjs；无第三方依赖；format.cjs导出format，trim后转大写；bin读argv[2]，空参数写stderr/exitCode=1，否则输出stdout；test/export.test.cjs使用内置node:test检查format。无engines声明。

调用：`$repo-pilot onboard 解释命令行工具，保存文档`。
输出：`.repopilot/00-start-here.md`，小项目合并，不创建01/02空壳。

## 完整输出：00-start-here.md

# Text Export上手入口

> ★ 必读；静态读取；任务onboard；小项目合并架构/技术栈。

### ★ 做什么

把用户传入文本修整为大写后输出到终端。

### ★ 架构

| 维度 | 结论/证据 |
| --- | --- |
| 工程 | 单包CLI，bin定义来自package.json |
| 运行 | 一个命令进程，argv输入、stdout/stderr输出；未执行 |
| 代码 | bin管参数/错误/I/O，src/format.cjs管纯转换 |
| 数据 | 字符串→trim/upper→输出，无持久化/网络证据 |

### ★ 技术栈

| 角色 | 技术/版本 | 用途与重要性 | 来源 |
| --- | --- | --- | --- |
| 运行/模块 | Node/CommonJS，项目版本未声明 | 核心：执行命令、require | bin清单和require |
| 参数/I/O | process.argv/stdout/stderr/exitCode | 核心：输入输出与错误 | bin/export.cjs |
| 转换 | JS字符串内置API | 核心：处理文本 | src/format.cjs |
| 测试 | 内置node:test/assert，版本随运行时未确认 | 重要：format例子 | test/export.test.cjs |

### ★ 重要位置与开始

1. 读package.json的bin与bin/export.cjs，回答输入/错误/输出分别由谁处理。
2. 读src/format.cjs，回答返回值与副作用；再回bin看结果消费者。
3. 读test/export.test.cjs，回答已覆盖纯转换而未覆盖CLI退出行为；测试命令来自清单但未执行。

新增导出格式的定位例：先参数解析，再格式处理/输出，再对照现有测试；不要引入UI/Router。

### ◆ 未确认

运行时版本未声明，需团队工具链/CI证据；输入错误的CLI测试未给定，不称已经覆盖；未运行测试。

### ○ 产物与来源

唯一产物本文件；合成例演示repo-pilot 0.4.0 onboard，示例日期2026-10-11；无Git revision。已读给定清单、命令、转换和测试，无依赖/服务/环境读取。正式生成附实际路径/符号/行号。

## 验收

小项目合并后仍有架构、技术栈和行动点；内置API不是第三方库，不凑框架/数据库。例子位置是合成输入，正式使用重新读取。
