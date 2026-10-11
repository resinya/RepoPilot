import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'RepoPilot';

// GitHub Pages 项目站地址：https://<user>.github.io/<repo>/
// 绑定自定义域名后，在部署环境配 NEXT_PUBLIC_SITE_URL 覆盖即可
const DEFAULT_SITE_URL = 'https://resinya.github.io/RepoPilot';

/**
 * 归一化 NEXT_PUBLIC_SITE_URL。
 *
 * 这个值会在构建期被 layout.tsx 拿去做 metadataBase，只要它不是合法的绝对 URL
 * 就会抛 ERR_INVALID_URL，直接让构建失败。两种最容易踩的填法：
 *   - 留空：环境变量是空字符串 ''，`??` 兜底拦不住，new URL('') 直接挂
 *   - 漏协议头：填 example.com 而不是 https://example.com
 *
 * 所以这里做三步兜底：补协议 → 去尾斜杠 → 解析失败回退默认值。
 * 只在构建日志里警告，绝不中断构建。
 */
function resolveSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) return DEFAULT_SITE_URL;

  const hasScheme = /^https?:\/\//i.test(trimmed);
  try {
    const url = new URL(hasScheme ? trimmed : `https://${trimmed}`);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('仅支持 http/https');
    }
    return url.pathname === '/' ? url.origin : url.origin + url.pathname;
  } catch {
    console.warn(
      `[RepoPilot] NEXT_PUBLIC_SITE_URL 不是合法地址（收到 "${trimmed}"），已回退到 ${DEFAULT_SITE_URL}。`,
    );
    return DEFAULT_SITE_URL;
  }
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const siteTitle = 'RepoPilot · 陌生仓库探索 AI Skill';

export const siteDescription =
  'RepoPilot 是一个给 AI agent 用的仓库探索技能：先构建一张可导航的项目地图，' +
  '再根据你当下的目标按需深入代码，产出架构分层、业务链路追踪与可执行的上手路径。' +
  '支持 Claude Code、Codex、Cursor 等 agent，一行命令安装。';

export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'resinya',
  repo: 'RepoPilot',
  branch: 'main',
};

/**
 * 导航栏与侧边栏的分类入口。
 * slug 必须与 content/docs/ 下的目录名一致，否则链接 404。
 */
export const categories = [
  {
    slug: 'guide',
    title: '指南',
    description: '安装 RepoPilot 并跑通第一个任务。',
  },
  {
    slug: 'how-it-works',
    title: '原理',
    description: '三层加载机制与为什么有时不触发。',
  },
  {
    slug: 'reference',
    title: '参考',
    description: '目录结构、CLI 命令、常见问题。',
  },
];

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
