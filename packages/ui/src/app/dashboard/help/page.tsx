'use client';

import { Box } from "@tokens-studio/ui";

const Page = () => {

    return (
        <Box
            css={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: '$gray1',
                isolation: 'isolate',
            }}
        />
    );
};


export default Page;
