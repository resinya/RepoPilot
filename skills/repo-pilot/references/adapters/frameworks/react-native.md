# React Native / Expo — 原生入口、导航树与需求落点

## 何时加载、输入与效果

react-native 依赖、JS/TS 入口、原生工程或 Expo 入口证据支持时加载；手机浏览器 React 页面用 React Web 规则。

输入：目标 iOS/Android/Web 端、package main/脚本、app 配置文本、原生工程候选。
效果：注册/框架入口→全局包装→Navigator/文件路由→Screen→JS 与原生边界。复用 M/C/D，替换 E1～E4。规则待真实项目验收。

## N1：确认真正注册入口与原生工程边界

1. 从 package.json 读取 main、scripts、React Native/Expo 声明；检查 index/App、app.json/app.config 文本、Metro/Babel 与 ios/android 的存在。目录缺失不能证明没有原生能力，Expo 可能生成工程。
2. Bare/普通 RN：跟 AppRegistry.registerComponent 的 app key 与根组件，再核对原生宿主加载的组件标识。多注册项分别说明。
3. Expo：按当前 main 跟 registerRootComponent 或框架入口；Expo Router 则查 main 对路由入口的引用，以及 app 或 src/app 的实际路由目录。不要假设 App.tsx 一定被使用。
4. app.config.js/ts、Metro/Babel 配置只读取，不能通过执行拿最终值；动态计算写未知。
5. iOS Info.plist/工程设置、Android manifest/Gradle 只读与入口/能力/构建相关项；签名证书、keystore、服务账号、推送凭证均排除。
6. headless/background 入口与展示根分开；只有实际注册/调用证据才说存在。

记录“平台宿主/框架入口→注册 key/模块→根组件”，注明 JS 和原生间已确认/未确认处。
参考：[AppRegistry](https://reactnative.dev/docs/appregistry)、[Expo Router 目录规则](https://docs.expo.dev/router/basics/notation/)；实际版本按目标项目复核。

## N2：读根包装与导航，不找 DOM 挂载

1. 先读根 return/提前返回，列状态/查询、主题、安全区、手势、持久化恢复、登录/资源加载等实际包装。
2. View/Text/Image/Pressable 等为原生界面组件；不能套 div、DOM/CSS选择器、HTML根容器的读法。
3. 找 NavigationContainer 或实际导航方案；Stack/Tab/Drawer 的配置、嵌套、初始页和 Screen 注册映射分别记录。
4. Expo Router：读取 _layout、Stack/Tabs 与页面文件、路由组/动态段/Slot；路由组和文件 URL 按版本规则核对。
5. 若业务自定义 navigator 跟其实现；Provider 名称不能替代具体实例/参数证据。
6. 登录门/权限请求/字体或资源加载只解释首屏条件，先不展开全部生命周期与性能。

完成：根包装树＋一条导航到 Screen。路由名不等于 HTTP URL，deep link 的 scheme/路径单独从 linking/配置确认。

## N3：从 Screen 看组件、数据与平台差异

1. Screen return→列表/表单/工具栏/弹层→主要组件文件。
2. 读取 navigation/route params、Hook/store/查询与事件入口；不将 route.params 自动当浏览器 query。
3. 分平台看 .ios/.android/.native 文件和 Platform 分支；同名目录要由真实解析约定/配置证明。
4. 网络封装、认证存储、上传/下载、缓存/离线只跟目标相关方向；只说凭证来源类型，不读取值。
5. 定位需要设备能力的模块：相机、通知、定位、文件、蓝牙、支付等有证据再列；区分 JS 包调用、Expo模块、Native Module/TurboModule 与缺失源码边界。
6. 动画/手势/列表等核心库给白话用途与已见 API。后端请求仍走公共 C3，原生页面也不等于直接操作数据库。

完成：能告诉用户“这个页面的内容和交互在哪里；改动在 JS、共享模块还是原生端”。

## N4：项目规范与验证前提

按相邻 Screen 的写法提取：目录/导出、导航参数类型、通用控件、StyleSheet/实际样式系统、响应式与安全区、权限/错误/加载约定、查询封装与测试。
记录已声明的 Metro/Expo、Android/iOS 构建/检查命令及目录。模拟器、设备、Xcode/Android SDK、平台限制和登录环境写为前提；不自动 prebuild、pod install、安装包或启动调试器。

例如“详情页新增附件入口”：Screen→公共按钮→navigation/deep link/附件服务→平台权限/下载边界→同类页面→现有 JS 测试与设备验收项。交 [需求定位卡](../../workflows/locate.md)，静态检查不能证明设备运行成功。

## 停止条件与容易误判的地方

- ios/android 不在仓库：记录工程生成/外部原生边界，不自动生成。
- 缺 native module 源码：解释调用契约，不伪造实现。
- 本机不能做 iOS 构建：保留平台验收项，不为获得结论修改环境。
- React return 树能复用结构观察，DOM挂载/浏览器代理/HTML5拖拽不能直接套用。

通过：入口、导航到 Screen、关键平台边界、项目开发例子与定位卡齐备；未做原生运行验证单独写明。
