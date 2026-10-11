# React Web — 入口、页面组装与需求落点

## 何时加载、输入与效果

存在 React/react-dom 与 Web 源码或框架页面证据时加载。本规则替换公共 SOP 的 E1～E4 结构读法，M/C/D 继续复用，不额外生成报告。

输入：选定应用、清单声明版本、构建入口候选、用户目标。
效果：一条有证据的挂载/框架入口→全局包装→路由/外壳→页面→能力模块；新人知道如何找改动位置。

## R1：从工程配置找真正入口

1. 先核对本应用 React、react-dom、路由和构建器的声明范围；同仓库多个应用分别记录。没有 lock 解析就不叫精确安装版本。
2. 读取 dev/start/build 指向的配置文本、HTML script 或入口插件；搜索范围限定应用，候选 createRoot、hydrateRoot、旧 ReactDOM.render。
3. 跟配置 entry 到实际 import，再核对 DOM 容器和传入组件；main/index/App 名字不能作为唯一依据。
4. 若是 Next 等框架页面，先从 package/框架配置与实际 app/pages 目录确认模式，读取根 layout/page 或 _app/页面；不强找手写 createRoot，不把服务端组件都算客户端。混合入口分别标界限。
5. 记录薄入口的重导出、别名和真实实现；多个挂载根分别列用途；Portal 是另一个展示位置，不自动当独立应用。

完成：解释“为什么它是入口”，附上配置/挂载位置或框架约定。缺少构建来源就保留候选状态。
参考：[React createRoot](https://react.dev/reference/react-dom/client/createRoot)、[hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)。旧版本依项目官方文档复核，不要求升级。

## R2：先读 return，再补影响页面出现的初始化

读取顺序：根组件相关 return→提前返回→Provider实例→影响首屏的初始化。
画缩进树，保留兄弟、条件和 children。例如下列只是读法示例：

    状态 Provider
      Query Provider
        主题 Provider
          Main
            加载/失败：相应页面
            正常：
              Dnd Provider
                OfflineNotice
                RouterRoot
                可选 UpdateNotice

不要将 OfflineNotice 画为 Router 的父节点。Provider 名称相似不证明使用同一实例；看 value/client/store 传参和创建位置。缓存恢复门、登录/平台配置等待、Suspense 和错误边界各说明作用及条件，首轮不逐行讲所有 effect。

根组件千行时按 import、签名、return、提前返回及必要初始化定向读取；截断部分不算已读。找不到 return 时检查类组件 render、包装组件、函数表达式与 re-export。

完成：一张结构树＋全局能力短表，能解释正常页面何时出现。

## R3：按实际 Router API 找到一个典型页面

- 对象路由：顺 createBrowserRouter/useRoutes 等声明，找 element、children、loader/redirect，再到 RouterProvider 和 Outlet。
- JSX 路由：顺 Router/Routes/Route；旧版本可能 Switch、component/render 等写法，必须核对版本。
- 文件路由：跟目录约定和 layout/页面文件，注明框架自动组成的部分。
- 自定义路由：跟实际模块出口与调用，不因名字含 Router 就认定返回 Router。

先选主导航或用户需求关联的一条路径，记录 basename、参数、query、懒加载/重导出、守卫、Layout 与实际页面。只解释守卫放行所需数据与未放行时行为，前端无某守卫不等于后台无鉴权。

完成：URL/导航→路由定义→守卫/外壳→插槽→页面，至少连续一条；其余主路由简表即可。

## R4：按页面块寻找核心能力

先看页面 return，把工具栏、过滤、列表/画布、属性、弹层分块；对主要组件跟真实 import。再找 props、本地 state、Context/store、查询缓存与动作入口。

能力地图用“产品作用→组件/模块→关联包→输入/输出方向”。拖入物料、画布位移/缩放、属性表单、动态渲染、节点连线分别定位，不能因均含 drag 就拼成一套库。

核心库卡只列已看到的 API：
- 查询库：白话说明“保存远端数据的缓存”，跟当前 useQuery/useMutation 及项目封装；v3 的 react-query 与后续 @tanstack/react-query 分清。
- 状态库：说明保存哪些客户端状态，跟实际 atom/selector、store/action 或 hooks；不把远端缓存等同全局状态。
- 拖拽库：源/目标或排序上下文分别对应哪一块，HTML5 backend 不证明移动触摸可用。
- 动态组件：跟注册映射/模块加载/真实 JSX 实例；registry 包不等于本地同名 workspace。
API 用项目已读位置佐证；概念未知查对应版本官方文档，不复制整套 API 教程。

## R5：接入需求定位

示例“列表增加一个展示字段”：导航/路由→列表页→列/卡片组件→实际数据类型/查询→同类字段→测试。返回公共 [需求定位](../../workflows/locate.md)，列应改/应复核/外部边界，并给同类实现。

示例“解释物料完整渲染与节点更新”：先提供真实能力入口与未确认处，再交内部deep子流程，不把首轮拖进内部算法。

## React Web 移动与验收

手机页面仍按上述结构，另核对独立路由、响应式/viewport、安全区、输入/触摸、手势冲突、分享/返回和构建目标。管理“移动端内容”的后台页面不一定是手机消费页；不要把 Web React 标成 React Native。

通过：已确认入口链、一个典型页面、产品核心位置、核心包实际使用和需求定位卡。未启动/触摸/请求验证如实注明。规则来自企业 React 静态分析方法，运行行为与不同宿主效果需另验收。

