/* eslint-disable import/no-anonymous-default-export */
/** @type {import('next').NextConfig} */

import analyzer from '@next/bundle-analyzer';

const OTEL_ENABLED = process.env.OTEL_ENABLED === 'true';
const ANALYZE = process.env.ANALYZE === 'true';

const withBundleAnalyzer = analyzer({
  enabled: ANALYZE,
})

export default {
  reactStrictMode: true,
  transpilePackages: ['@tokens-studio/graph-editor', '@tokens-studio/graph-engine'],
  env: {
    API_PATH: process.env.API_PATH,
  },
  experimental: {
    //Terrible hack to fix
    optimizePackageImports: ['iconoir-react', "lodash"],
    // esmExternals: 'loose',
    optimizeCss: process.env.NODE_ENV === 'production',
    //Add Open telemetry support https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry
    instrumentationHook: OTEL_ENABLED
  },
  compiler: {
    //  removeConsole: process.env.NODE_ENV === 'production'
  },
  output: "standalone"
};
