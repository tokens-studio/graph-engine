import { Heading } from '@tokens-studio/ui/Heading.js';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Separator } from '@tokens-studio/ui/Separator.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { router as auth } from '@/api/controllers/auth.ts';
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
				params: {
					id: params.id
				}
			})
		}),
		queryClient.prefetchQuery({
			queryKey: ['getWhoAmI'],
			queryFn: runContract(auth.getWhoAmI)
		})
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Stack direction='column' width='full' gap={3}>
				<Heading size='large'>Publish</Heading>
				<Separator orientation='horizontal' />
				<div style={{ padding: 'var(--component-spacing-2xl)' }}>
					<Inner />
				</div>
			</Stack>
		</HydrationBoundary>
	);
};

export default Page;
