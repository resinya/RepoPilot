# Unity 客户端 — 场景、对象、UI 与需求落点

## 何时加载、输入与效果

Assets、ProjectSettings/ProjectVersion.txt 与 Packages/manifest.json 等共同支持 Unity 时加载。Unity 是客户端分支，不能套 React 的 main.tsx、Provider 和浏览器路由。

输入：目标产品能力/场景、Unity版本、文本场景/资源是否可读、目标平台。
效果：启动场景→GameObject/组件→UI/Prefab→交互脚本→服务边界，支持快速找改动位置。复用 M/C/D。当前仅规则落地，待 Unity 真项目验收。

## U1：识别工程、包和启动候选

1. 读取 ProjectVersion.txt 确认编辑器版本；Packages/manifest.json 和相关本地包清单确认直接包，packages-lock 文件可补解析证据；不打开下载缓存。
2. 列 Assets 的场景、脚本、UI、Prefab 和数据配置目录。自动生成 .csproj/解决方案是线索，不是唯一架构真相；程序集边界看 .asmdef/.asmref。
3. 排除 Library、Temp、Logs、Obj、Build/Builds、缓存、录屏/大资源、证书/签名/凭证；不导入项目让编辑器重建。
4. 从当前版本构建场景列表/Build Profile 的文本配置与启动/加载脚本确认启动候选；缺少实际 profile 或动态选择就标未知，不能把名为 Main 的场景直接当首场景。
5. 找场景加载、常驻 bootstrap、RuntimeInitializeOnLoadMethod、资源加载器等实际来源；Addressables/AssetBundle/Resources 只有真实使用证据才列。
6. 手机/桌面/WebGL/嵌入式宿主分别核对配置证据，平台字符串不是实际构建完成的证明。

完成：版本/包/程序集地图、启动场景或候选＋理由。动态/二进制场景读不了时止于脚本与已知资源边界。
参考：[Unity UI 方案](https://docs.unity3d.com/Manual/UI-system-compare.html)、[MonoBehaviour](https://docs.unity3d.com/Manual/class-MonoBehaviour.html)。按目标版本文档复核配置格式。

## U2：从场景对象找真正行为，不只搜 C# 类

1. 场景/Prefab 为可读文本时，定位对象层级、Transform父子、MonoBehaviour引用与UI组件；先列关键对象，不展开所有网格/材质。
2. 通过序列化引用中的 GUID/fileID 和对应 .meta 找脚本/资源；GUID仅证明资源映射，fileID/场景对象才能补实例关系。保留未解引用。
3. Prefab实例、变体、override 或运行时 Instantiate 分开记录；不要把所有 Prefab 当启动时都会实例化。
4. 找附着到对象的 MonoBehaviour，以及 Awake/OnEnable/Start 中与初始化相关的行为，概括依赖/订阅/加载；同名方法存在不证明脚本已挂载或一定执行。
5. 属性 [SerializeField]/公开字段的实际赋值可能来自 Inspector/场景，不能只靠 C#默认值推定运行参数。
6. 未知脚本执行顺序/动态创建时不编造完整时序；C# import/程序集引用不是渲染树。

记录“场景→关键对象→组件→脚本→序列化输入”，每跳有文本证据或明确未知。使用实际架构名 Model/Wrapper/MVC/ECS 等时要找到类型和调用证据，不仅凭用户名词推整个模式。

完成：能把用户看到的界面对象与脚本/Prefab位置连接。无可读场景则提供待在编辑器核对的具体对象/引用，不声称完整还原。

## U3：辨认 UI 体系与页面/场景切换

- uGUI：从 Canvas、RectTransform、Prefab与UI组件看页面块，再跟 Button/事件绑定、控制脚本和打开/关闭方法。
- UI Toolkit：从 UIDocument、UXML/USS 与 controller脚本看可视树；跟 rootVisualElement、元素查询、回调注册/注销等实际 API。
- 混合：两套体系分别列边界；3D世界对象与UI屏幕不要混成单一路由树。
- 场景/界面切换：跟 SceneManager、实际UI管理器或导航状态，记录谁触发、加载目标、异步/常驻边界；不把所有切换叫URL路由。

针对可视化/交互平台，定位选择、拖拽/操控、模型/节点呈现、属性面板、保存/加载等能力。首轮说明位置和输入输出方向；物理、坐标、渲染管线与节点更新算法交深度分析。

完成：一个用户入口→场景/UI对象→界面组成→交互入口的典型例子。

## U4：找到项目式开发方法与需求落点

读项目贡献/编辑器版本要求→同类 Prefab/脚本/数据配置→程序集与测试→构建/CI文本。
提取命名、脚本/资源目录、序列化字段、事件解绑、资源生命周期、Prefab编辑规则与 .meta 管理；不要强制迁移到新的 UI 体系。

例“给现有面板新增操作按钮”：
目标界面→Canvas/UIDocument或Prefab→控制脚本→现有按钮/事件例子→模型/服务方法→EditMode/PlayMode测试或手动验收前提。
主要改动候选可包含脚本、Prefab/UXML、配置；只有源码存在才标可改。不要凭 C#脚本推断必须直接修改序列化资源。
请求/后端只跟真实传输封装和相关协议，Unity客户端也不能直接推定数据库或Nest服务。

回到 [需求定位](../../workflows/locate.md) 给定位卡。编辑器版本、目标平台SDK、资源包和设备是运行前提；首次不启动编辑器、不导入资产、不执行构建、不升级包。

## 通过与停止

通过：工程/场景边界、对象到脚本的已知链、UI体系、核心能力位置、一个同类实现和需求定位卡。
停止：场景二进制、Inspector参数未读、动态资源目录缺失、外部DLL无源码、profile不明。说明下一次编辑器/运行验证需观察什么；静态关联不叫已运行成功。
