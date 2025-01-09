import { Button } from '@tokens-studio/ui/Button.js';
import { useOpenPanel } from '@tokens-studio/graph-editor';
import Eye from '@tokens-studio/icons/Eye.js';
import PalettePreview from './panel.js';
import React from 'react';

export const Palette = ({ node }) => {
	const { toggle } = useOpenPanel();

	return (
		<Button
			fullWidth
			emphasis='high'
			onClick={() => {
				toggle({
					group: 'popout',
					title: 'Color Palette',
					id: node.id,
					content: <PalettePreview inputs={node.inputs} />
				});
			}}
			icon={<Eye />}
		>
			Toggle Preview
		</Button>
	);
};
