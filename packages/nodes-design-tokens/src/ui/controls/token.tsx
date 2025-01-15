import { IField } from '@tokens-studio/graph-editor';
import { PreviewColor } from './preview/color.js';
import { SingleToken, TokenTypes } from '@tokens-studio/types';
import { Stack } from '@tokens-studio/ui';
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
	token: SingleToken;
	hideName?: boolean;
};

export const PreviewToken = ({ token, hideName }: PreviewProps) => (
	<Stack direction='row' gap={3}>
		{token && (
			<>
				{getPreview(token)}
				{!hideName && (
					<div
						style={{
							font: 'var(--font-body-xs)',
							color: 'var(--color-neutral-canvas-default-fg-default)',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis'
						}}
						title={token.name}
					>
						{token.name || 'No name'}
					</div>
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
			style={{ width: '100%' }}
			key={token?.name}
			align='center'
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					flexGrow: 1,
					alignItems: 'center',
					gap: 'var(--component-spacing-sm)',
					overflow: 'hidden',
					paddingLeft: 'var(--component-spacing-md)'
				}}
			>
				<PreviewToken token={token} />
			</div>
			<div
				title={getToolTipData(token)}
				style={{
					font: 'var(--font-body-xs)',
					color: 'var(--color-neutral-canvas-default-fg-muted)',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					maxWidth: '200px',
					textOverflow: 'ellipsis'
				}}
			>
				{getNodeValue(token)}
			</div>
		</Stack>
	);
};

export const TokenField = observer(({ port }: IField) => {
	return <Token token={port.value} />;
});
