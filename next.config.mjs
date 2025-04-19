/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/cosplay-recruitment',      // GitHub Pages のパス対策
  assetPrefix: '/cosplay-recruitment',   // 静的アセット読み込み対策
}

export default nextConfig
