import { castToHex } from '../../utils/index.js';
import { observer } from 'mobx-react-lite';
import Color from 'colorjs.io';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './panel.module.css';
import type ColorSwatch from './node.js';

export const ColorSwatchPreview = observer(
	({ inputs }: { inputs: ColorSwatch['inputs'] }) => {
		const [colorName, setColorName] = useState<string>('');
		const [color, setColor] = useState<Color>();

		const debouncedFetchColorName = useCallback(
			(() => {
				let timeout: NodeJS.Timeout;
				return (hex: string) => {
					clearTimeout(timeout);
					timeout = setTimeout(async () => {
						try {
							const response = await fetch(
								`https://api.color.pizza/v1/?values=${hex}`
							);
							const data = await response.json();
							setColorName(data.colors[0]?.name ?? '');
						} catch (error) {
							console.error('Failed to fetch color name:', error);
						}
					}, 250);
				};
			})(),
			[]
		);

		useEffect(() => {
			if (!inputs.color?.value) return;

			try {
				const hex = castToHex(inputs.color.value);
				const newColor = new Color(hex);
				setColor(newColor);
				debouncedFetchColorName(hex.replace('#', ''));
			} catch (error) {
				console.error('Failed to process color:', error);
			}
		}, [inputs.color?.value, debouncedFetchColorName]);

		return (
			<>
				{inputs.color && (
					<div
						className={styles.swatch}
						style={{ backgroundColor: castToHex(inputs.color.value) }}
					>
						<div className={styles.colorName}>{colorName}</div>
						<dl className={styles.info}>
							<dt>{color?.spaceId}</dt>
							<dd>{color?.toString()}</dd>
							<dt>HEX</dt>
							<dd>{color?.toString({ format: 'hex' })}</dd>
							<dt>HSL</dt>
							<dd>{color?.to('hsl').toString()}</dd>
						</dl>
					</div>
				)}
			</>
		);
	}
);

export default ColorSwatchPreview;
