import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getServerClient } from '@/api/sdk/getServerClient.ts';
import { router as graphs } from '@/api/controllers/graph.ts';
import { runContract } from '@/api/server/index.ts';
import Inner from './clientPage.tsx';
import React from 'react';

const Page = async ({ params }) => {
	const queryClient = getServerClient();
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ['getGraph', params.id],
			queryFn: runContract(graphs.getGraph, {
				params
			})
		})
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Inner id={params.id} />
		</HydrationBoundary>
	);
};
export default Page;
