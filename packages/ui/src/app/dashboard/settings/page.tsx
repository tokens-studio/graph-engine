'use client';

import { Box, Stack } from '@tokens-studio/ui';
import Inner from './clientPage.tsx';

const Page = () => {
	return (
		<Stack
			css={{
				position: 'relative',
				width: '100%',
				height: '100%',
				overflow: 'auto',
				background: '$gray1',
				paddingTop: '$6'
			}}
			justify='center'
		>
			<Box css={{ padding: '$5', width: '80%' }}>
				<Inner />
			</Box>
		</Stack>
	);
};

export default Page;
