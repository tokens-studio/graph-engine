'use client';

import { QueryProvider } from '@/api/sdk/provider.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastProvider } from '@/hooks/useToast.tsx';
import { Tooltip } from '@tokens-studio/ui/Tooltip.js';
import React from 'react';

const inDevEnvironment = !!process && process.env.NODE_ENV === 'development';

export default function Contexts({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<QueryProvider>
			<ToastProvider>
				<Tooltip.Provider>{children}</Tooltip.Provider>
			</ToastProvider>
			{inDevEnvironment && <ReactQueryDevtools />}
		</QueryProvider>
	);
}
