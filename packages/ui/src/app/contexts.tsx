'use client';

import { QueryProvider } from '@/api/sdk/provider.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@tokens-studio/ui/Toast.js';
import { TooltipContainer } from '@tokens-studio/ui';
import React from 'react';

const inDevEnvironment = !!process && process.env.NODE_ENV === 'development';

export default function Contexts({ children }) {
	return (
		<QueryProvider>
			{children}
			<TooltipContainer id="default-tooltip-id" />
			<Toaster />
			{inDevEnvironment && <ReactQueryDevtools />}
		</QueryProvider>
	);
}
