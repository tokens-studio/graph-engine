"use-client"

import { ToastProvider } from '@/hooks/useToast.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Tooltip } from '@tokens-studio/ui';
import React from 'react';

export const Providers = ({ children }) => {

    const queryClient = new QueryClient()
    return <ToastProvider>
        <QueryClientProvider client={queryClient}>
            <Tooltip.Provider>
                {children}
            </Tooltip.Provider>
        </QueryClientProvider>
    </ToastProvider>
}
