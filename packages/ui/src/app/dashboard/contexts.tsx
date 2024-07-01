'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/hooks/useToast.tsx';
import React from 'react';
import Store from '@/redux/index.tsx';

export default function Contexts({ children }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Store>{children}</Store>
      </ToastProvider>
    </QueryClientProvider>
  );
}
