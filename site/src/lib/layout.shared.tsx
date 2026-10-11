import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, categories, docsRoute, gitConfig } from './shared';

/**
 * 顶部导航里的分类入口，数据源是 shared.ts 的 categories。
 * active: 'nested-url' 让分类下的子页面也能让顶层保持高亮。
 */
const navLinks: BaseLayoutProps['links'] = categories.map((category) => ({
  text: category.title,
  url: `${docsRoute}/${category.slug}`,
  active: 'nested-url' as const,
}));

export function baseOptions(
  options: { navTransparent?: boolean; includeNavLinks?: boolean } = {},
): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      ...(options.navTransparent ? { transparentMode: 'top' as const } : {}),
    },
    // 文档页传 false：侧边栏的页面树已经列出这几个分类，再渲染一遍是重复
    links: options.includeNavLinks === false ? [] : navLinks,
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
