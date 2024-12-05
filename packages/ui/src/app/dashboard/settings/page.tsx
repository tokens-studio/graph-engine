'use client';

import { Stack } from '@tokens-studio/ui';
import Inner from './clientPage.tsx';

const Page = () => {
	return (
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
			<div style={{ padding: 'var(--component-spacing-xl)', width: '80%' }}>
				<Inner />
			</div>
		</Stack>
	);
};

export default Page;
