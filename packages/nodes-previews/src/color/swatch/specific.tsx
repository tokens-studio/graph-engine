import { Button } from '@tokens-studio/ui/Button.js';
import { useOpenPanel } from '@tokens-studio/graph-editor';
import ColorSwatchPreview from './panel.js';
import Eye from '@tokens-studio/icons/Eye.js';
import React from 'react';

export const ColorSwatch = ({ node }) => {
	const { toggle } = useOpenPanel();

	return (
		<Button
			fullWidth
			emphasis='high'
			onClick={() => {
				toggle({
					group: 'popout',
					title: 'Color Swatch',
					id: node.id,
					content: <ColorSwatchPreview inputs={node.inputs} />
				});
			}}
			icon={<Eye />}
		>
			Toggle Preview
		</Button>
	);
}; 