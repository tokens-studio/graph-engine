import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getServerClient } from '@/api/sdk/getServerClient.ts';
import { router as market } from '@/api/controllers/marketplace.ts';
import { runContract } from '@/api/server/index.ts';
import Inner from './clientPage.tsx';

const Page = async ({ params }) => {
	const serverClient = getServerClient();
	await serverClient.prefetchQuery({
		queryKey: ['market', 'getGraph', params.id],
		queryFn: runContract(market.getGraph, {
			params: {
				id: params.id
			}
		})
	});

	return (
		<HydrationBoundary state={dehydrate(serverClient)}>
			<Inner {...params} />
		</HydrationBoundary>
	);
};

export default Page;
