# Map：项目地图与边界

## 输入、职责、产出

输入：目标、应用/功能范围、已有地图。结果是职责地图、入口、关键目录和重要位置，不独立证明架构范式。路径及模板按[outputs](../contracts/outputs.md)。

## 步骤

| 步骤 | 读取/动作 | 结果 | 完成条件 |
| --- | --- | --- | --- |
| 1 查边界 | 根目录、README、只读Git、清单/工作区；不显示认证URL | 仓库/成员范围 | 嵌套Git/submodule/链接/junction标边界不默默跟进 |
| 2 确认成员 | 清单、workspace、启动/导出定义；按[workspace](../adapters/workspace.md) | 应用/服务/共享库候选表 | 含清单不等于应用，根包可能只编排任务 |
| 3 找入口 | 按命中adapter读真实注册、启动、导出或场景 | 名称、目录、职责、入口 | 不猜main；无入口标候选和下一证据 |
| 4 画核心地图 | 折叠应用→业务模块→关键文件，附职责/读后答案 | 文件树/重要位置 | 目录解释为工作职责，不只翻译src/components |
| 5 核对关系 | 声明→实际import/注入→请求/消息→代理/路由 | 标签化关键关系 | 声明/依赖/调用/外部未知分开 |
| 6 交付检查 | [地图模板](../../assets/templates/map.md)，推荐约3个位置 | 范围、地图、先读位置、未知 | 图表可定位，未统计不称中心度排名 |

排除node_modules/vendor/.venv、dist/dev_dist/build/out/target、coverage/.next/.nuxt/.vite、Git内部/Agent配置/知识目录/缓存；原生/游戏排除Pods/.gradle/DerivedData/Library/Temp/Logs/Obj/Builds。真实环境、证书和认证存储按证据契约排除。

## 工具失败与停点

可选inventory只输出候选，默认10,000项/16层，partial如实说明。complete只指排除规则内遍历。没有Python/rg用宿主工具，清单/配置当文本不执行。预算/不可读缩小覆盖；同名/别名先确认真实引用。

## 例子与验收

CLI地图应是“bin注册→参数/核心处理→输出/测试”，见[CLI](../examples/cli-library.md)；多应用见[Web＋服务](../examples/web-service.md)。用户能知道要改某能力先打开哪个位置，地图即达标；架构判断转architecture，不由图形补证据。
