'use client';

import { Box, Stack } from '@tokens-studio/ui';
import Contexts from '@/app/contexts.tsx';
import Rail from '@/components/rail.tsx';
export default function Layout({ children }) {
	return (
		<Stack css={{ height: '100%', width: '100%' }}>
			<Contexts>
				<Box>
					<Rail />
				</Box>
				<Box css={{ flex: '1' }}>
					{' '}
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
						<Box css={{ padding: '$5', width: '80%' }}>{children}</Box>
					</Stack>
				</Box>
			</Contexts>
		</Stack>
	);
}
