'use client';

import { Stack } from '@tokens-studio/ui';
import Contexts from '../contexts.tsx';
import Rail from '@/components/rail.tsx';

export default function Layout({ children }) {
	return (
		<Stack style={{ height: '100%', width: '100%' }}>
			<Contexts>
				<div>
					<Rail />
				</div>
				<div style={{ flex: '1' }}>{children}</div>
			</Contexts>
		</Stack>
	);
}
