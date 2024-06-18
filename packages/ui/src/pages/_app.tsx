// https://nextjs.org/docs/advanced-features/custom-app
import '../scripts/wdyr';

import 'sanitize.css';
import 'sanitize.css/assets.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/system-ui.css'
import 'sanitize.css/typography.css';
import 'sanitize.css/ui-monospace.css';

import { AppProps } from 'next/app.ts';
import { Head } from '@/components/next/index.ts';
import { ThemeProvider } from 'next-themes';
import { Tooltip } from '@tokens-studio/ui';
import { dark, light } from '@/config/themes.ts';
import { globalState } from '@/mobx/index.tsx';
import NoSSR from 'react-no-ssr';
import PageLayout from '@/components/next/layout/page.tsx';
import React from 'react';
import Store from '../redux/index.tsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
