// https://nextjs.org/docs/advanced-features/custom-app
import '../scripts/wdyr';
import '@tokens-studio/graph-editor/index.css';
import './styles.css';

import { AppProps } from 'next/app.ts';
import { Head } from '#/components/next/index.ts';
import { ThemeProvider } from 'next-themes';
import { dark, light } from '#/config/themes.ts';
import NoSSR from 'react-no-ssr';
import PageLayout from '#/layout/page.tsx';
import React from 'react';
import Store from '../redux/index.tsx';
import { Tooltip } from '@tokens-studio/ui';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <Head
      as={ThemeProvider}
      attribute="class"
      enableSystem={false}
      value={{ 'light-theme': light, 'dark-theme': dark }}
      body={
        <NoSSR>
          <Tooltip.Provider>
            <Store>
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </Store>
          </Tooltip.Provider>
        </NoSSR>
      }
    />
  );
}
