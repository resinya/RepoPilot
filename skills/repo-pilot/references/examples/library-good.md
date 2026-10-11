# 正例：一个库的一份项目使用指南

## 输入与证据约束

合成教学夹具：apps/web声明@tanstack/react-query 4；src/bootstrap.tsx创建QueryClient/Provider，hooks/useProducts.ts使用useQuery，pages/Products.tsx使用useMutation/useQueryClient与invalidateQueries，api/products.ts提供调用项目request的list/rename。字段与角色是演示条件，不是本次企业源码。

以下是交付范例。正式输出须附实读行号和准确版本依据；不能复制路径就声称读过。

---

# TanStack Query在Web应用中的用法

> 范围：产品列表与改名；本例声明Query4。静态示意，未运行。只交付此文档，不另拆文件树/API/流程文件。

## 目录

[引用树](#引用文件树) → [概念](#它解决什么) → [流程](#项目里的使用流程) → [API](#常用api与实际使用) → [用例](#项目内用例) → [开发](#按项目方式扩展) → [未知](#未知)。

## 引用文件树

    apps/web/
      package.json                 1 包与版本声明
      src/bootstrap.tsx            2 QueryClient与Provider
      src/hooks/useProducts.ts     3 项目查询Hook
      src/pages/Products.tsx       4 列表消费与改名动作
      src/api/products.ts          5 业务API
      src/api/request.ts           6 底层网络封装

bootstrap是注册/实例，useProducts和Products是业务调用；request不是Query库API。此例未给测试，不能编造测试文件。

## 它解决什么

它管理远端数据在客户端的缓存，而不替代项目传输封装：
- queryKey像缓存标签，列表的筛选条件参与标签区分。
- queryFn是去拿数据的函数，交给库决定何时调用。
- mutation处理写入，成功后可通知相关查询重新读取。
- QueryClient管理缓存，Provider把它交给下面的组件。
这些是本例Query4中的概念，不等于所有版本签名相同。

## 项目里的使用流程

bootstrap创建QueryClient并提供给页面→Products调用useProducts→Hook用标签和list函数登记查询→list调用request→响应被缓存，页面显示。
用户改名→页面mutation调用rename→完成后invalidateQueries标记相关查询失效并按库机制重新读取。
Provider包裹属于结构，改名调用属于动作；上述是静态预期，不是网络抓包。

## 常用API与实际使用

| API | 白话用途 | 本例使用位置 | 项目作用 |
| --- | --- | --- | --- |
| QueryClient | 管理缓存实例 | bootstrap | 创建全局实例 |
| QueryClientProvider | 向组件提供实例 | bootstrap | 页面可访问同一客户端 |
| useQuery | 读取/缓存远端数据 | useProducts | 列表与筛选条件 |
| useMutation | 执行写入 | Products | 产品改名 |
| useQueryClient | 获取当前客户端 | Products | 更新后操作缓存 |
| invalidateQueries | 使匹配查询失效 | Products | 改名后重新取列表 |
| setQueryData | 直接改缓存 | 本例未见 | 是官方API，不能说项目用了 |

版本依据为夹具输入。常用API依据 [Query4快速开始](https://tanstack.com/query/v4/docs/framework/react/quick-start)；项目使用列依据本例给定源码角色。真正报告必须用实读位置，而不是把官方例子当项目调用。

项目封装useProducts不是第三方库原生API；request才负责实际HTTP。上手优先复用项目Hook，不能因为会useQuery就将所有请求写进页面。

## 项目内用例

以改名为例：选中记录提供id，输入框提供name→rename发给已存在的业务API→成功回调使产品列表标签失效→相关列表按查询规则刷新。权限、失败提示与缓存范围必须读实际分支；这里只展示给定主链。

可给简化伪代码：事件 → mutation({id,name}) → 成功 → invalidateProducts。它用于理解角色，不是未经核对即可复制的目标项目源码。

## 按项目方式扩展

要增加列表筛选：改页面已有筛选控件和类型；沿现有useProducts把参数送到list，同时核对queryKey是否包含影响结果的条件。照相邻筛选/错误/加载写法开发，不换网络库。
验证：类型检查、已有查询测试（若存在）、切换筛选的结果与缓存、改名后刷新；尚未实施。

## 未知

本例没提供真实后端、失败分支、测试和锁解析，不能说接口可达或全仓只用Query4。真实项目输出这些边界，并给下一处文件；内部缓存算法不是此次学习目标。

---

## 为什么这是正例

引用树放在前面，概念和API均落到同一个项目场景；常用但未见的API明确标注。读者知道哪个封装应该复用，如何照现有写法增加需求。文档自足，库原理不抢项目用法。
