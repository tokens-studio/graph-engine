import { QueryClient } from '@tanstack/query-core';

//Always make a new server client each time to prevent data leaking between requests
export const getServerClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000
			}
		}
	});
};
