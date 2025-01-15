import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import clsx from 'clsx';
import styles from './panel.module.css';
import type TypographyNode from './node.js';

const getTypographyStyle = token => {
	if (!token?.value || token.type !== 'typography') return {};

	const {
		fontSize,
		fontFamily,
		fontWeight,
		lineHeight,
		letterSpacing,
		textCase,
		textDecoration,
		paragraphSpacing
	} = token.value;

	return {
		fontSize,
		fontFamily,
		fontWeight,
		lineHeight,
		letterSpacing,
		textTransform: textCase,
		textDecoration,
		marginBottom: paragraphSpacing
	};
};

const FontFamilyPreview = ({ fontFamily, weights }) => (
	<div
		className={clsx(styles.fontPreview, 'ts-canvas')}
		data-appearance='neutral'
		data-emphasis='subtle'
	>
		<div className={styles.fontName}>{fontFamily.split(',')[0].trim()}</div>
		<div className={styles.fontSample} style={{ fontFamily }}>
			<span className={styles.fontSampleText}>Aa</span>
		</div>
		<div className={styles.fontWeights}>
			{weights.map(weight => (
				<span key={weight} style={{ fontWeight: weight }}>
					{weight}
				</span>
			))}
		</div>
	</div>
);

export const TypographyPreview = observer(
	({ inputs }: { inputs: TypographyNode['inputs'] }) => {
		const { typographyTokens, fontFamilies } = useMemo(() => {
			const tokens = inputs.tokens?.value || [];
			const typographyTokens = tokens.filter(
				token => token.type === 'typography'
			);

			// Extract unique font families and their weights
			const fontFamilies = new Map();
			typographyTokens.forEach(token => {
				const fontFamily = token.value?.fontFamily;
				const weight = token.value?.fontWeight;
				if (fontFamily) {
					if (!fontFamilies.has(fontFamily)) {
						fontFamilies.set(fontFamily, new Set());
					}
					if (weight) {
						fontFamilies.get(fontFamily).add(weight);
					}
				}
			});

			return { typographyTokens, fontFamilies };
		}, [inputs.tokens?.value]);

		return (
			<div className={styles.container}>
				<div className={styles.header}>
					{Array.from(fontFamilies.entries()).map(([family, weights]) => (
						<FontFamilyPreview
							key={family}
							fontFamily={family}
							weights={Array.from(weights).sort(
								(a, b) => Number(a) - Number(b)
							)}
						/>
					))}
				</div>

				<table className={styles.table}>
					<thead>
						<tr>
							<th>Preview</th>
							<th>Name</th>
							<th>Font Size</th>
							<th>Line Height</th>
							<th>Weight</th>
							<th>Letter Spacing</th>
						</tr>
					</thead>
					<tbody>
						{typographyTokens.map(token => (
							<tr key={token.name}>
								<td>
									<div
										className={styles.preview}
										style={getTypographyStyle(token)}
									>
										The quick brown fox jumped over the lazy dog
									</div>
								</td>
								<td>{token.name || 'Unnamed'}</td>
								<td>{token.value?.fontSize}</td>
								<td>{token.value?.lineHeight}</td>
								<td>{token.value?.fontWeight}</td>
								<td>{token.value?.letterSpacing}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
);

export default TypographyPreview;
