# Vue Web — 模板、插件、路由插槽与需求落点

## 何时加载、输入与效果

Vue 依赖、.vue 源码、应用/框架入口共同支持时加载。用本规则替换 E1～E4；公共项目地图、需求定位、交付继续复用。不能仅把 React 的 return 一词换成 template。

输入：主应用、Vue/路由/状态/构建声明版本、配置与入口候选。
效果：入口创建/插件→根模板→路由插槽→页面→核心能力的连续地图。当前规则已编写，未以本次 React 案例宣称 Vue 实测通过。

## V1：确认应用创建与框架分支

1. 从清单和实际 import 区分 Vue 2/3，不从 .vue 文件名推版本；锁文件未读则记声明范围。
2. 普通 Web 项目：配置/HTML entry→模块→Vue 3 createApp/createSSRApp 与 mount；旧项目核对实际 new Vue、el/$mount、router/store 注入。
3. 先读创建与挂载之间的 app.use、app.provide、app.component、指令及样式导入，记录全局能力来源和注册对象。
4. Nuxt 等生成入口：核对框架版本与实际页面、布局、插件、中间件、配置目录，按对应约定找根/页面边界；不硬找 main.ts。SSR/客户端专用插件分别说明。
5. 模块仅 re-export 或调用项目 bootstrap 则跟到实现；配置只当文本，不运行插件。

完成：记录 HTML/框架入口→根组件→插件/注入→挂载/页面来源。
参考：[Vue 应用 API](https://vuejs.org/api/application.html)。这里只用于定位，不将最新 API 强加旧版本。

## V2：先读模板/渲染函数，分清全局与局部包装

1. 优先读根组件 template；没有模板时读 render/JSX。列 Layout、RouterView、页面、全局弹层、条件和 slots。
2. 读取 v-if/v-else、v-for、动态 component/is、Teleport、Suspense 等已使用结构；不能将全部分支画为同时存在。
3. 插件 app.use 是应用注册关系，不等于一层模板 Provider。provide/inject 则跟 key、提供值、消费者与所在组件层级。
4. 插槽顺着父组件传入内容和子组件 slot 接收位置看；作用域 slot 还需概括数据来源。
5. 再补 script setup/setup 或 Options API 中影响页面出现的初始化：权限/配置、computed/ref/reactive、onMounted/watch；只概括首屏必要条件。
6. components/import 未写出的子组件可能由自动导入/全局注册提供，核对构建插件和注册表；不直接断言“组件不存在”。

记录两张小表：模板树，以及“全局插件/注入→用途→注册/消费者位置”。避免把注册顺序当渲染时序。

完成：说明正常页面如何组成、哪些条件阻止显示、公共能力如何提供。

## V3：路由到页面，保留插槽关系

1. 看实际路由版本/API和 router 创建模块，记录 routes、history/base、children、redirect、lazy imports。
2. 从导航目标/path/name 跟到 record 的 component/components，再到 RouterView；命名视图保留名字，不能全塞进默认视图。
3. 找父 Layout 与子 RouterView 的实际位置；子路径与父路径如何组合按当前配置确认。
4. beforeEach、beforeEnter、组件守卫和框架中间件只概括与目标相关的权限/跳转；不要把所有异步初始化都称守卫。
5. 至少举一条“导航→路由记录→布局/RouterView→页面→主要组件”。

参考：[Vue Router 嵌套路由](https://router.vuejs.org/guide/essentials/nested-routes.html)。实际版本的路径行为须核对，不默认采用文档最新写法。

## V4：页面、状态、请求和能力位置

页面先列模板内容块，再看 props、emit/v-model、store、composable 与请求服务：
- 父给子什么；子通过 emit/model 怎么回报变化。
- Pinia/Vuex/自定义 store 以实际声明与消费者为准；不能一见 Vue 3 就假定 Pinia。
- composable 可能返回状态或查询描述，只有真实调用网络封装才能算请求；Axios/Fetch 库按实际项目确认。
- 可视化平台按物料源、放置区、画布、配置、组件映射/动态加载、预览分别找，首轮只解释作用、位置、核心包、连接方向。

每个核心库卡：用途、白话概念、声明版本、实际 API、位置。若包是全局插件或动态加载，说明引用索引的覆盖边界。

## V5：照现有方式定位需求

例如“新增列表筛选项”：
路由→页面模板筛选区→项目已有表单组件→绑定 ref/store→watch/提交动作→请求参数→同类筛选测试。
从相邻实现提取 SFC 组织、类型/导出、样式 scoped/module/工具类、composable/store 分层、错误/加载约定，而不是给通用 Vue 最佳实践。

返回 [需求定位](../../workflows/locate.md) 交一张定位卡，涉及原生桥或外部包就停在接口边界。移动 Web 另核对触摸/响应式，不把 Vue 页面误判为原生应用。

通过：一条真实创建/模板/路由链、核心模块、项目内开发例子和定位卡。没有样本或缺源码时保留未知，绝不声称 Vue 全场景已验收。
