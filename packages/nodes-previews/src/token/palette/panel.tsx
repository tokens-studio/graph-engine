import { Text } from '@tokens-studio/ui/Text.js';
import { observer } from 'mobx-react-lite';
import React from 'react';
import clsx from 'clsx';
import styles from './panel.module.css';
import type PaletteNode from './node.js';

type TokenValue = {
	value: string;
	type: string;
};

type NestedTokens = {
	[key: string]: TokenValue | NestedTokens;
};

type TokenSet = {
	[key: string]: NestedTokens;
};

interface ColorSwatchProps {
	name: string;
	value: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, value }) => (
	<div
		className={clsx(styles.swatch, 'ts-canvas')}
		data-appearance='neutral'
		data-emphasis='subtle'
	>
		<div className={styles.color} style={{ backgroundColor: value }} />
		<div className={styles.colorInfo}>
			<Text size='small' bold className={styles.colorNumber}>
				{name}
			</Text>
			<Text size='small' className={styles.colorValue}>
				{value}
			</Text>
		</div>
	</div>
);

interface ColorGroupProps {
	name: string;
	tokens: NestedTokens;
}

const ColorGroup: React.FC<ColorGroupProps> = ({ name, tokens }) => {
	const colorTokens: ColorSwatchProps[] = [];
	const groups: { name: string; tokens: NestedTokens }[] = [];

	// Sort tokens into colors and subgroups
	Object.entries(tokens).forEach(([key, token]) => {
		if (token && typeof token === 'object') {
			if (
				'type' in token &&
				token.type === 'color' &&
				'value' in token &&
				typeof token.value === 'string'
			) {
				colorTokens.push({
					name: key,
					value: token.value
				});
			} else if (!('type' in token)) {
				groups.push({
					name: key,
					tokens: token as NestedTokens
				});
			}
		}
	});

	if (colorTokens.length === 0 && groups.length === 0) return null;

	return (
		<div className={styles.group}>
			<Text className={styles.groupName}>{name}</Text>
			{colorTokens.length > 0 && (
				<div className={styles.swatches}>
					{colorTokens.map(color => (
						<ColorSwatch key={color.name} {...color} />
					))}
				</div>
			)}
			{groups.map(group => (
				<ColorGroup key={group.name} name={group.name} tokens={group.tokens} />
			))}
		</div>
	);
};

export const PalettePreview = observer(
	({ inputs }: { inputs: PaletteNode['inputs'] }) => {
		const tokenSet = (inputs.tokenSet?.value as TokenSet) || {};

		return (
			<div className={clsx(styles.container, 'ts-canvas')}>
				{Object.entries(tokenSet).map(([name, tokens]) => (
					<ColorGroup key={name} name={name} tokens={tokens} />
				))}
			</div>
		);
	}
);

export default PalettePreview;
