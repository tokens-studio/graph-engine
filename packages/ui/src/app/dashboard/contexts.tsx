'use client';

import { QueryProvider } from "@/api/sdk/provider.tsx";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastProvider } from '@/hooks/useToast.tsx';
import React from "react";
import Store from "@/redux/index.tsx";
import React from 'react';
import Store from '@/redux/index.tsx';

const inDevEnvironment = !!process && process.env.NODE_ENV === 'development';


export default function Contexts({ children }) {
    return <QueryProvider>
        <ToastProvider>
            <Store>
                {children}
            </Store>
        </ToastProvider>
        {inDevEnvironment && <ReactQueryDevtools />}
    </QueryProvider>;
}
