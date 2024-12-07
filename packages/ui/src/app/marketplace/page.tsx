import { Heading } from '@tokens-studio/ui/Heading.js';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Separator } from '@tokens-studio/ui/Separator.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { getServerClient } from '@/api/sdk/getServerClient.ts';
import { router as market } from '@/api/controllers/marketplace.ts';
import { runContract } from '@/api/server/index.ts';
import Inner from './clientPage.tsx';

const Page = async () => {
	const serverClient = getServerClient();
	await serverClient.prefetchQuery({
		queryKey: ['market', 'listGraphs'],
		queryFn: runContract(market.listGraphs)
	});

	return (
		<HydrationBoundary state={dehydrate(serverClient)}>
			<Stack direction='column' width='full' gap={3}>
				<Heading size='large'>Showcase</Heading>
				<Separator orientation='horizontal' />
				<Inner />
			</Stack>
		</HydrationBoundary>
	);
};

export default Page;
