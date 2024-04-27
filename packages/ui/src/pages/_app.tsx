// https://nextjs.org/docs/advanced-features/custom-app
import '../scripts/wdyr';
import '@tokens-studio/graph-editor/index.css';
import '../styles/styles.scss';

import { AppProps } from 'next/app.ts';
import { Head } from '@/components/next/index.ts';
import { ThemeProvider } from 'next-themes';
import { dark, light } from '@/config/themes.ts';
import NoSSR from 'react-no-ssr';
import PageLayout from '@/components/next/layout/page.tsx';
import React from 'react';
import Store from '../redux/index.tsx';
import { Tooltip } from '@tokens-studio/ui';
import { globalState } from '@/mobx/index.tsx';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ToastProvider } from '@/hooks/useToast.tsx';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const queryClient = new QueryClient()
  return (
    <Head
      as={ThemeProvider}
      attribute="class"
      enableSystem={false}
      value={{ 'light-theme': light, 'dark-theme': dark }}
      body={
        <NoSSR>
          <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <Tooltip.Provider>
              <Store>
                <PageLayout theme={globalState.ui.theme}>
                  <Component {...pageProps} />
                </PageLayout>
              </Store>
            </Tooltip.Provider>
          </QueryClientProvider>
          </ToastProvider>
        </NoSSR>
      }
    />
  );
}
