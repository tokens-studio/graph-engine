import { Button } from '@tokens-studio/ui/Button.js';
import { useOpenPanel } from '@tokens-studio/graph-editor';
import DimensionScalePreview from './panel.js';
import Eye from '@tokens-studio/icons/Eye.js';
import React from 'react';

export const DimensionScale = ({ node }) => {
	const { toggle } = useOpenPanel();

	return (
		<Button
			fullWidth
			emphasis='high'
			onClick={() => {
				toggle({
					group: 'popout',
					title: 'Dimension Scale',
					id: node.id,
					content: <DimensionScalePreview inputs={node.inputs} />
				});
			}}
			icon={<Eye />}
		>
			Toggle Preview
		</Button>
	);
};