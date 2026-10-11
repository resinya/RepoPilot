import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, docsRoute, siteDescription } from '@/lib/shared';

export const metadata: Metadata = {
  title: '首页',
  description: siteDescription,
};

const installCommand =
  'npx skills add resinya/RepoPilot --global --skill repo-pilot --yes --copy';

const prompts = [
  '帮我把这个仓库跑起来，告诉我每一步和可能卡住的地方。',
  '帮我理清这个项目的架构，先给我一张地图。',
  '我是新接手的人，告诉我按什么顺序看这份代码。',
  '这条下单链路从哪里进、到哪里结束，中间有哪些分支。',
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-20">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">RepoPilot</h1>
      <p className="mb-10 text-fd-muted-foreground">{siteDescription}</p>

      <h2 className="mb-3 text-lg font-semibold">安装</h2>
      <pre className="mb-3 overflow-x-auto rounded-lg border bg-fd-secondary p-4 text-sm">
        <code>{installCommand}</code>
      </pre>
      <p className="mb-12 text-sm text-fd-muted-foreground">
        装完开一个新会话，直接对 agent 说话即可。去掉 <code>--global</code>{' '}
        就装进当前项目，随仓库提交给同事。
      </p>

      <h2 className="mb-3 text-lg font-semibold">它做什么</h2>
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="mb-1 text-sm font-semibold">项目地图</h3>
          <p className="text-sm text-fd-muted-foreground">
            先建一张可导航的地图，而不是把整个仓库解释一遍。职责标注来自真实引用关系。
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="mb-1 text-sm font-semibold">架构与链路</h3>
          <p className="text-sm text-fd-muted-foreground">
            识别分层与外部依赖边界，从入口沿调用链走到数据落地，结论带文件路径锚点。
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="mb-1 text-sm font-semibold">上手路径</h3>
          <p className="text-sm text-fd-muted-foreground">
            给出可执行的下一步动作，含 Windows 与 Linux 差异，而不是描述性说明。
          </p>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">试试这样说</h2>
      <ul className="mb-12 space-y-2">
        {prompts.map((prompt) => (
          <li
            key={prompt}
            className="rounded-lg border bg-fd-secondary/50 px-4 py-2 text-sm"
          >
            {prompt}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-4">
        <Link
          href={docsRoute}
          className="rounded-full bg-fd-primary px-5 py-2 text-sm font-medium text-fd-primary-foreground"
        >
          阅读文档
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`${docsRoute}/${category.slug}`}
            className="rounded-full border px-5 py-2 text-sm font-medium"
          >
            {category.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
