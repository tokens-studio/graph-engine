'use client';

const Page = () => {
	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				background: 'var(--color-neutral-canvas-minimal-bg)',
				isolation: 'isolate'
			}}
		/>
	);
};

export default Page;
