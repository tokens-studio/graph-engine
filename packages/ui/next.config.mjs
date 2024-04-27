/* eslint-disable import/no-anonymous-default-export */
/** @type {import('next').NextConfig} */

import analyzer from '@next/bundle-analyzer';

const OTEL_ENABLED = process.env.OTEL_ENABLED === 'true';
const ANALYZE = process.env.ANALYZE === 'true';

const withBundleAnalyzer = analyzer({
  enabled: ANALYZE,
})

export default withBundleAnalyzer({
  swcMinify: true,
  reactStrictMode: true,
  // basePath: '/beta',
  transpilePackages:['@tokens-studio/graph-editor','@tokens-studio/graph-engine'],
  env:{
    API_PATH: process.env.API_PATH,
  },
  experimental: {
    forceSwcTransforms:true,
    //Terrible hack to fix
    optimizePackageImports: ['iconoir-react',"lodash"],
    // esmExternals: 'loose',
    optimizeCss: process.env.NODE_ENV === 'production',
    //Add Open telemetry support https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry
    instrumentationHook: OTEL_ENABLED
  },
  compiler: {
    //  removeConsole: process.env.NODE_ENV === 'production'
  },
  output: "export",
  webpack: (config, { dev, isServer }) => {

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    if (dev && !isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['main.js'] && !entries['main.js'].includes('./src/scripts/wdyr.ts')) {
          entries['main.js'].unshift('./src/scripts/wdyr.ts');
        }
        return entries;
      };
    }
    //Issue with colorjs.io
    // config.optimization.providedExports = true;
    return config;
  }
});
