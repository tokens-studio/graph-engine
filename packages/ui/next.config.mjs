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


    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: [{
          loader: '@svgr/webpack',
          options: {
            memo: true,
            typescript: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                'removeXMLNS',
                'removeDimensions'
              ]
            },
          },
        }]
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i


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
