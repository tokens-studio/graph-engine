import { Text } from '@tokens-studio/ui/Text.js';
import { castToHex } from '../../utils/index.js';
import { observer } from 'mobx-react-lite';
import Color from 'colorjs.io';
import React from 'react';
import styles from './panel.module.css';
import type ColorSwatch from './node.js';

function contrastingColor(value: string) {
	const black = new Color('srgb', [0, 0, 0]);
	const white = new Color('srgb', [1, 1, 1]);

	const background = new Color(value);
	const contrastBlack = Math.abs(background.contrast(black, 'APCA'));
	const contrastWhite = Math.abs(background.contrast(white, 'APCA'));

	return contrastBlack > contrastWhite ? '#000000' : '#ffffff';
}

export const ColorSwatchPreview = observer(
	({ inputs }: { inputs: ColorSwatch['inputs'] }) => {
		return (
			<div className={styles.container}>
				{inputs.color && (
					<div
						className={styles.swatch}
						style={{ backgroundColor: castToHex(inputs.color.value) }}
					>
						<Text
							size='large'
							style={{ color: contrastingColor(castToHex(inputs.color.value)) }}
						>
							{castToHex(inputs.color.value)}
						</Text>
					</div>
				)}
			</div>
		);
	}
);

export default ColorSwatchPreview;
