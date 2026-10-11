import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * GitHub Pages 是纯静态托管，没有 Node 运行时，所以必须静态导出。
 *
 * 部署地址是 https://<user>.github.io/RepoPilot/ —— 站点在**子路径**下，
 * 因此只有 Pages 构建时才需要 basePath / assetPrefix。本地开发加了反而会让
 * localhost:3000 变成 localhost:3000/RepoPilot，所以用环境变量区分：
 *   PAGES=1 pnpm build   → CI 走这条
 *   pnpm dev             → 本地，无 basePath
 */
const isPages = process.env.PAGES === '1';
const basePath = isPages ? '/RepoPilot' : undefined;

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // 静态导出，产物输出到 out/
  output: 'export',

  // 静态导出下 next/image 的优化服务不可用，必须关闭
  images: { unoptimized: true },

  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
};

export default withMDX(config);
