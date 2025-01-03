import { Button } from '@tokens-studio/ui/Button.js';
import { useOpenPanel } from '@tokens-studio/graph-editor';
import Eye from '@tokens-studio/icons/Eye.js';
import React from 'react';
import TokenTablePreview from './panel.js';

export const TokenTable = ({ node }) => {
	const { toggle } = useOpenPanel();

	return (
		<Button
			fullWidth
			emphasis='high'
			onClick={() => {
				toggle({
					group: 'popout',
					title: 'Tokens Table',
					id: node.id,
					content: <TokenTablePreview inputs={node.inputs} />
				});
			}}
			icon={<Eye />}
		>
			Toggle Preview
		</Button>
	);
};
