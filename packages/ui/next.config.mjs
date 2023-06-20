/** @type {import('next').NextConfig} */


const config = {
  swcMinify: true,
  reactStrictMode: true,
  // basePath: '/beta',

  experimental: {
    // esmExternals: 'loose',
    optimizeCss: process.env.NODE_ENV === 'production'
  },
  compiler: {
    //  removeConsole: process.env.NODE_ENV === 'production'
  },
  output: "export",
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['raw.githubusercontent.com'],
  },
  webpack: (config, { dev, isServer }) => {

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
};

export default config;
