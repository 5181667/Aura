import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 关闭 React Compiler (节省内存)
  reactCompiler: false,
  
  // 跳过 ESLint 检查
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 跳过 TypeScript 类型检查
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 禁用生产环境 source maps (节省内存)
  productionBrowserSourceMaps: false,
  
  // 优化构建
  experimental: {
    // 减少内存占用
    webpackMemoryOptimizations: true,
  },
  
  // 图片优化配置
  images: {
    unoptimized: true, // 禁用图片优化，节省内存
  },
};

export default nextConfig;
