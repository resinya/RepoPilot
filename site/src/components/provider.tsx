'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import SearchDialog from './search';

/**
 * RootProvider 要接一个函数组件（SearchDialog），而 app/layout.tsx 是服务端组件，
 * 不能直接传函数进客户端边界，所以单独拆一层客户端 Provider 出来。
 */
export function Provider({ children }: { children: ReactNode }) {
  return <RootProvider search={{ SearchDialog }}>{children}</RootProvider>;
}
