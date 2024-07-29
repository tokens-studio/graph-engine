/* eslint-disable import/no-anonymous-default-export */
/** @type {import('next').NextConfig} */

import analyzer from '@next/bundle-analyzer';

const OTEL_ENABLED = process.env.OTEL_ENABLED === 'true';
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
    //Add Open telemetry support https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry
    instrumentationHook: OTEL_ENABLED
  },
  compiler: {
  
  },
  output: "standalone",
});
