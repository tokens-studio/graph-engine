import { Text } from '@tokens-studio/ui';
import React from 'react';

export const PreviewColor = ({ value }) => {
	if (value === undefined) {
		return <Text>Missing</Text>;
	}

	return (
		<div
			style={{
				border: '1px solid',
				borderColor: 'var(--color-neutral-stroke-subtle)',
				borderRadius: 'var(--component-radii-md)',
				overflow: 'hidden',
				display: 'flex',
				position: 'relative',
				width: '16px',
				height: '16px',
				flexShrink: '0'
			}}
		>
			<div
				style={{
					background: value,
					position: 'absolute',
					left: '-8px',
					top: '-8px',
					height: '64px',
					width: '64px',
					padding: 0,
					border: 'none',
					borderRadius: 0,
					outline: 'none'
				}}
			/>
		</div>
	);
};

export default PreviewColor;
