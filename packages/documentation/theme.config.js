/* eslint-disable import/no-anonymous-default-export */
import { useRouter } from "next/router";


const GITHUB_LINK = 'https://github.com/tokens-studio/graph-engine-docs';
const TITLE = 'Graph engine documentation'

const Slack = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.79948 0C7.47279 0.000978593 6.39909 1.07547 6.40007 2.39951C6.39909 3.72355 7.47377 4.79804 8.80046 4.79902H11.2009V2.40049C11.2018 1.07645 10.1271 0.00195719 8.79948 0C8.80046 0 8.80046 0 8.79948 0M8.79948 6.4H2.40039C1.07371 6.40098 -0.000977873 7.47547 2.67973e-06 8.79951C-0.00195842 10.1235 1.07273 11.198 2.39941 11.2H8.79948C10.1262 11.199 11.2009 10.1245 11.1999 8.80049C11.2009 7.47547 10.1262 6.40098 8.79948 6.4V6.4Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M24 8.79951C24.001 7.47547 22.9263 6.40098 21.5996 6.4C20.273 6.40098 19.1983 7.47547 19.1993 8.79951V11.2H21.5996C22.9263 11.199 24.001 10.1245 24 8.79951ZM17.6 8.79951V2.39951C17.601 1.07645 16.5273 0.00195719 15.2006 0C13.8739 0.000978593 12.7992 1.07547 12.8002 2.39951V8.79951C12.7982 10.1235 13.8729 11.198 15.1996 11.2C16.5263 11.199 17.601 10.1245 17.6 8.79951Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M15.1996 24.0001C16.5263 23.9991 17.601 22.9246 17.6 21.6005C17.601 20.2765 16.5263 19.202 15.1996 19.201H12.7992V21.6005C12.7982 22.9236 13.8729 23.9981 15.1996 24.0001ZM15.1996 17.5991H21.5997C22.9263 17.5981 24.001 16.5236 24 15.1996C24.002 13.8755 22.9273 12.801 21.6006 12.7991H15.2006C13.8739 12.8001 12.7992 13.8745 12.8002 15.1986C12.7992 16.5236 13.8729 17.5981 15.1996 17.5991V17.5991Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.70465e-07 15.1996C-0.000979882 16.5236 1.07371 17.5981 2.40039 17.5991C3.72708 17.5981 4.80177 16.5236 4.80079 15.1996V12.8H2.40039C1.07371 12.801 -0.000979882 13.8755 6.70465e-07 15.1996ZM6.40007 15.1996V21.5996C6.3981 22.9236 7.47279 23.9981 8.79948 24C10.1262 23.9991 11.2009 22.9246 11.1999 21.6005V15.2015C11.2018 13.8775 10.1271 12.803 8.80046 12.801C7.47279 12.801 6.39909 13.8755 6.40007 15.1996C6.40007 15.2005 6.40007 15.1996 6.40007 15.1996Z" fill="currentColor" />
  </svg>
);




export default {

  project: {
    link: GITHUB_LINK,
  },
  docsRepositoryBase: `${GITHUB_LINK}/blob/master`,
  chat: {
    icon: <Slack />,
    link: 'https://tokens.studio/slack'
  },
  logo: (
    <>
      <img src="/logo.svg" alt={`${TITLE} Logo`} className="mr-2" />
      <span className="mr-2 font-extrabold hidden md:inline">{TITLE}</span>
      <span className="opacity-75 font-normal hidden md:inline">
        Docs
      </span>
    </>
  ),

  useNextSeoProps() {
    // titleSuffix: ' – Tokens Studio for Figma',
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: `%s – ${TITLE}`
      }
    }
  },
  head: ({ title, meta }) => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { route } = useRouter();

    const lastDot = route.lastIndexOf('.')
    const path = route === '/index' ? '/' : route.slice(0, lastDot)
    const ogImage = `https://img.websnap.app/?url=https://docs.tokens.studio${path}&token=D5rpX7VfD3dACoyb&viewport_width=1200&viewport_height=630`;
    const ogTitle = title ? `${title} – ${TITLE}` : TITLE;
    return (
      <>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="description" content="Tokens Studio for Figma: Plugin Docs" />
        <meta name="og:description" content="Tokens Studio for Figma: Plugin Docs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site:domain" content="docs.tokens.studio" />
        <meta name="twitter:url" content="https://docs.tokens.studio" />
        <meta name="og:title" content={ogTitle} />
        <meta name="og:image" content={ogImage} />
        <meta name="apple-mobile-web-app-title" content="Tokens Studio for Figma Docs" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="stylesheet" href="/style.css" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      </>
    )
  },
  // Currently does not work with static exports
  // i18n: [
  //   { locale: 'en', text: 'English' },
  //   { locale: 'pt', text: 'Português (Brasil)' }
  // ],
  sidebar: {
    defaultMenuCollapseLevel: 1
  },
  search: {
    placeholder: 'Search'
  },
  navigation: {
    prev: true,
    next: true
  },
  toc: {
    float: true
  },
  footer: {
    component: <></>,
    text: <></>
  }
}
