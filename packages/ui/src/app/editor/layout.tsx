'use client';

import { Box, Stack } from '@tokens-studio/ui';
import Contexts from '../dashboard/contexts.tsx';
import Rail from '@/components/rail.tsx';

export default function Layout({ children }) {
	return (
		<Stack css={{ height: '100%', width: '100%' }}>
			<Contexts>
				<Box>
					<Rail />
				</Box>
				<Box css={{ flex: '1' }}>{children}</Box>
			</Contexts>
		</Stack>
	);
}
