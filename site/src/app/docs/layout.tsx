import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    // 传 false：侧边栏的页面树已经列出分类了，顶栏再渲染一遍是重复
    <DocsLayout tree={source.getPageTree()} {...baseOptions({ includeNavLinks: false })}>
      {children}
    </DocsLayout>
  );
}
