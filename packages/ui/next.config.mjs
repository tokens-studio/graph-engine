/* eslint-disable import/no-anonymous-default-export */
/** @type {import('next').NextConfig} */

import analyzer from '@next/bundle-analyzer';

const ANALYZE = process.env.ANALYZE === 'true';

const withBundleAnalyzer = analyzer({
  enabled: ANALYZE,
})

export default withBundleAnalyzer({
  reactStrictMode: true,
  transpilePackages: ['@tokens-studio/graph-editor', '@tokens-studio/graph-engine', 'mobx', 'colorjs.io'],
  webpack:(config,{isServer})=>{

    config.experiments={
      ...(config.experiments || {}),
      asyncWebAssembly: true
    }
    if (!isServer) {
      config.resolve.fallback = { fs: false,module:false };

    }

    return config
  },
  experimental: {
    esmExternals: true,
    //Terrible hack to fix
    optimizePackageImports: ['iconoir-react', "lodash"],
    // esmExternals: 'loose',
    optimizeCss: process.env.NODE_ENV === 'production',
  },
  compiler: {
  
  },
  output: "standalone",
});
