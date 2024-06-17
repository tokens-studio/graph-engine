// https://stitches.dev/docs/server-side-rendering
import { Head, Html, Main, NextScript } from 'next/document.js';
import { getCssText } from '@/lib/stitches/index.ts';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
        <meta
          name="description"
          content="Tokens Studio design tokens playground."
        />
        <meta name="author" content="Tokens Studio" />
        <meta
          name="keywords"
          content="Graph, resolvers, generator, design, tokens, studio, figma"
        />
        <meta name="theme-color" content="#408ECF" />
        <meta
          name="twitter:title"
          content="Resolver playground | Tokens Studio"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:site"
          content="https://resolver.dev.tokens.studio"
        />
        <meta name="twitter:creator" content="@AndrewAtTokens" />
        <meta
          name="twitter:image"
          content="https://resolver.dev.tokens.studio/thumbnail.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site" content="https://resolver.dev.tokens.studio" />
        <meta
          property="og:title"
          content="Resolver playground | Tokens Studio"
        />
        <meta
          property="og:description"
          content="Tokens studio alpha playground to test new resolver / generation functionality"
        />
        <meta
          property="og:image"
          content="https://resolver.dev.tokens.studio/thumbnail.png"
        />
        <meta
          property="og:image:alt"
          content="Display picture of Token Studio Resolver Sandbox"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Tokens Studio generator playground"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <body>
        <Main />


        <NextScript />
      </body>
    </Html>
  );
}
