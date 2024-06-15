// https://stitches.dev/docs/server-side-rendering
import { Head, Html, Main, NextScript } from 'next/document.js';
import { getCssText } from '@/lib/stitches/index.ts';
import Script from 'next/script.js';

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
        {(typeof window != 'undefined' && !(window as any).mixpanel && <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split( " "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for ( var d = {}, e = ["get_group"].concat( Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);

              mixpanel.init('79f1e1683ceadf0847033e4e3674fb32', {debug: true, track_pageview: true, persistence: 'localStorage'});
  `,
          }}
        />)}
      </Head>
      <body>
        <Main />


        <NextScript />
      </body>
    </Html>
  );
}
