import { Stack } from '@tokens-studio/ui/Stack.js';
import { Text } from '@tokens-studio/ui/Text.js';
import { observer } from 'mobx-react-lite';
import React from 'react';
import clsx from 'clsx';
import styles from './panel.module.css';
import type DimensionScale from './node.js';

export const DimensionScalePreview = observer(
	({ inputs }: { inputs: DimensionScale['inputs'] }) => {
		const tokens = inputs.scale?.value || [];
		const dimensionTokens = tokens.filter(token =>
			['dimension', 'sizing', 'spacing'].includes(token.type)
		);

		console.log(inputs.scale.value);
		console.log(dimensionTokens);

		return (
			<Stack direction='column' className={styles.container} gap={2}>
				<Stack direction='row' className={styles.stacked} gap={2} wrap>
					{dimensionTokens.map(token => (
						<div className={styles.item}>
							<Text size='small'>{token.value}</Text>
							<div
								className={clsx(styles.box, 'ts-surface')}
								data-appearance='accent'
								data-emphasis='subtle'
								style={{
									width: token.value,
									height: token.value
								}}
							/>
						</div>
					))}
				</Stack>
				<div className={styles.layered}>
					{dimensionTokens.map(token => (
						<div
							className={clsx(styles.item, 'ts-surface')}
							data-appearance='accent'
							data-emphasis='ghost'
							style={{
								width: token.value,
								height: token.value
							}}
						/>
					))}
				</div>
			</Stack>
		);
	}
);

export default DimensionScalePreview;
