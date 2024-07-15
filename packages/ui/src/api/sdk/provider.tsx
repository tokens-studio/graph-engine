'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			//Neeeded to prevent immediate refecting on the client from the server
			staleTime: 60 * 1000
		}
	}
});

export function QueryProvider({ children }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
