'use client';

import { Stack } from '@tokens-studio/ui';
import Contexts from '@/app/contexts.tsx';
import Rail from '@/components/rail.tsx';
export default function Layout({ children }) {
	return (
		<Stack style={{ height: '100%', width: '100%' }}>
			<Contexts>
				<div>
					<Rail />
				</div>
				<div style={{ flex: '1' }}>
					{' '}
					<Stack
						style={{
							position: 'relative',
							width: '100%',
							height: '100%',
							overflow: 'auto',
							background: 'var(--color-neutral-canvas-minimal-bg)',
							paddingTop: 'var(--component-spacing-2xl)'
						}}
						justify='center'
					>
						<div
							style={{ padding: 'var(--component-spacing-2xl)', width: '80%' }}
						>
							{children}
						</div>
					</Stack>
				</div>
			</Contexts>
		</Stack>
	);
}
