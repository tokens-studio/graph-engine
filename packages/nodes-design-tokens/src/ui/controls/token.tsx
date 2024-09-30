import { Box } from '@tokens-studio/ui/Box.js';
import { IField } from '@tokens-studio/graph-editor';
import { PreviewColor } from './preview/color.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { TokenTypes } from '@tokens-studio/types';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const getPreview = tokenData => {
	switch (tokenData?.type) {
		case TokenTypes.COLOR:
			return <PreviewColor value={tokenData.value} />;
		default:
			return null;
	}
};

type PreviewProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	token: any;
	hideName?: boolean;
};

export const PreviewToken = ({ token, hideName }: PreviewProps) => (
	<Stack direction='row' gap={3}>
		{token && (
			<>
				{getPreview(token)}
				{!hideName && (
					<Box
						css={{
							fontWeight: '$sansRegular',
							fontFamily: 'monospace',
							fontSize: '$xsmall',
							color: '$fgMuted',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis'
						}}
						title={token.name}
					>
						{token.name || 'No name'}
					</Box>
				)}
			</>
		)}
	</Stack>
);

export default PreviewToken;

const getToolTipData = data => {
	if (typeof data == 'object') {
		return JSON.stringify(data, null, 4);
	}

	return data?.value;
};

const getTypographyValue = data => {
	if (typeof data?.value == 'string') {
		return data.value;
	}
	return `<Complex Typography>`;
};

const getNodeValue = data => {
	switch (data?.type) {
		case 'typography':
			return getTypographyValue(data);
		case 'composition':
			return 'Composition';
		case 'border':
			return 'Border';
		case 'boxShadow':
			return 'Shadow';
		default:
			return data?.value;
	}
};

export const Token = ({ token }) => {
	return (
		<Stack
			direction='row'
			css={{ width: '100%' }}
			key={token?.name}
			align='center'
		>
			<Box
				css={{
					display: 'flex',
					justifyContent: 'space-between',
					flexGrow: 1,
					alignItems: 'center',
					gap: '$2',
					overflow: 'hidden',
					paddingLeft: '$3'
				}}
			>
				<PreviewToken token={token} />
			</Box>
			<Box
				title={getToolTipData(token)}
				css={{
					fontFamily: 'monospace',
					fontSize: '$xsmall',
					color: '$fgSubtle',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					maxWidth: '200px',
					textOverflow: 'ellipsis'
				}}
			>
				{getNodeValue(token)}
			</Box>
		</Stack>
	);
};

export const TokenField = observer(({ port }: IField) => {
	return <Token token={port.value} />;
});
