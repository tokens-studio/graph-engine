import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
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
			<Inner />
		</HydrationBoundary>
	);
};

export default Page;
