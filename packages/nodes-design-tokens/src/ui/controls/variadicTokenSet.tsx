import { Edge, Port } from '@tokens-studio/graph-engine';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { getPreview } from './token.js';
import { withVariadicField } from '@tokens-studio/graph-editor';
import React from 'react';

const VariadicTokensUI = ({ port, edge }: { port: Port; edge: Edge }) => {
	const value = port.value[edge.annotations['engine.index']];
	if (!Array.isArray(value)) return null;

	return (
		<Stack
			gap={2}
			align='center'
			title={`${port.name} - ${edge.annotations['engine.index']}`}
			style={{
				padding: 'var(--component-spacing-md)',
				maxWidth: '200px',
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			}}
		>
			{(value || []).map(token => getPreview(token))}
		</Stack>
	);
};

export const VariadicTokenSet = withVariadicField(VariadicTokensUI);
