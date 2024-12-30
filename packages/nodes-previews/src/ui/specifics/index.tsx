import { Button } from '@tokens-studio/ui/Button.js';
import { useOpenPanel } from '@tokens-studio/graph-editor';
import ColorScalePreview from '../panels/color/colorScale.js';
import Eye from '@tokens-studio/icons/Eye.js';
import React from 'react';

const ColorScale = ({ node }) => {
	const { toggle } = useOpenPanel();

	return (
		<Button
			fullWidth
			emphasis='high'
			onClick={() => {
				toggle({
					group: 'popout',
					title: 'Test Preview',
					id: node.id,
					content: <ColorScalePreview inputs={node.inputs} />
				});
			}}
			icon={<Eye />}
		>
			Toggle Preview
		</Button>
	);
};

export const specifics = {
	'studio.tokens.previews.colorScale': ColorScale
};
