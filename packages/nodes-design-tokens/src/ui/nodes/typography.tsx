import { Separator, Stack, Text } from '@tokens-studio/ui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import type PreviewNode from '../../nodes/previewTypography.js';

export const Typography = ({ value, text }) => {
	return (
		<>
			<Separator orientation='horizontal' />
			<Stack direction='column' gap={2} style={{ padding: 'var(--component-spacing-md)' }}>
				{value.map((token, index) => {
					const value = token.value;
					let css = {};
					let fontSize = undefined;

					switch (token.type) {
						case 'typography':
							css = {
								fontFamily: value.fontFamily,
								fontSize: value.fontSize,
								fontWeight: value.fontWeight,
								lineHeight: value.lineHeight,
								letterSpacing: value.letterSpacing
							};
							fontSize = value.fontSize;
							break;
						case 'fontSizes':
						case 'dimension':
							css = {
								fontSize: value
							};
							fontSize = value;
							break;
						case 'fontWeights':
							css = {
								fontWeight: value
							};
							break;
						case 'lineHeights':
							css = {
								lineHeight: value
							};
							break;
						case 'letterSpacings':
							css = {
								letterSpacing: value
							};
							break;
						case 'fontFamilies':
							css = {
								fontFamily: value
							};
							break;
						default:
							return null;
					}

					return (
						<Stack direction='row' gap={3} key={index} align='center'>
							<Text>{token.name}</Text>
							<span title={JSON.stringify(token, null, 4)}>
								<div style={{ display: 'inline' }}>
									<span style={css}>{text}</span>
								</div>
							</span>
							<Text>{fontSize}</Text>
						</Stack>
					);
				})}
			</Stack>
		</>
	);
};

export const TypographyPreview = observer(({ node }: { node: PreviewNode }) => {
	return (
		<Typography text={node.inputs.text.value} value={node.inputs.value.value} />
	);
});

export default TypographyPreview;
