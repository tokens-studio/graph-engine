import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { router as auth } from '@/api/controllers/auth.ts';
import { getServerClient } from '@/api/sdk/getServerClient.ts';
import { router as graphs } from '@/api/controllers/graph.ts';
import { runContract } from '@/api/server/index.ts';
import Inner from './clientPage.tsx';
import React from 'react';

const Page = async () => {
	const queryClient = getServerClient();
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ['listGraphs'],
			queryFn: runContract(graphs.listGraphs)
		}),
		queryClient.prefetchQuery({
			queryKey: ['getWhoAmI'],
			queryFn: runContract(auth.getWhoAmI)
		})
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Inner />
		</HydrationBoundary>
	);
};

export default Page;
