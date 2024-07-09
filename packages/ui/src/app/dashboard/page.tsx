import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { client } from '@/api/sdk/index.ts';
import { getServerClient } from '@/api/sdk/getServerClient.ts';
import Inner from './clientPage.tsx';
import React from 'react';

const Page = async () => {
	const serverClient = getServerClient();
	await client.graph.listGraphs.prefetchQuery(
		serverClient,
		['listGraphs'],
		{},
		{
			staleTime: 5000
		}
	);

	return (
		<HydrationBoundary state={dehydrate(serverClient)}>
			<Inner />
		</HydrationBoundary>
	);
};

export default Page;
