import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { client } from '@/api/sdk/index.ts';
import { getServerClient } from '@/api/sdk/getServerClient.ts';
import Inner from './clientPage.tsx';
import React from 'react';

const Page = async ({ params }) => {

    
    const { id } = params;
    const serverClient = getServerClient();
    await client.graph.getGraph.prefetchQuery(
        serverClient,
        ['getGraph', id],
        {
        },
        {
            staleTime: 5000,
        },
    );


    return (
        <HydrationBoundary state={dehydrate(serverClient)}>
            <Inner id={params.id} />
        </HydrationBoundary>
    );



};
export default Page;
