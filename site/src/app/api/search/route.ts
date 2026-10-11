import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

/**
 * 静态模式搜索。
 *
 * 站点跑在 GitHub Pages 上，没有 Node 服务端，/api/search 这个 handler
 * 在运行时是不存在的。所以改用 staticGET：构建期把索引烘进静态文件，
 * 搜索在浏览器里算。对应的客户端要换成 useStaticSearch（见 components/search.tsx）。
 *
 * revalidate = false 是必须的，否则 Next 会把它当动态路由，静态导出时报错。
 */
export const revalidate = false;
export const { staticGET: GET } = createFromSource(source);
