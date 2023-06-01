import { NodeDefinition, NodeTypes } from '../../types.js';

export const type = NodeTypes.HARMONIC_SERIES;

export const defaults = {
	base: 16,
	ratio: 1.5,
	stepsDown: 0,
	steps: 5,
	notes: 1
};

type HarmonicTypographyValue = {
	size: number;
	frequency: number;
	note: number;
};

export const process = (input, state) => {
	const final = {
		...state,
		...input
	};

	const fontSizes: HarmonicTypographyValue[] = [];

	for (let i = 0 - final.stepsDown; i < final.steps; i++) {
		for (let j = 0; j < final.notes; j++) {
			const fontSize =
				final.base * Math.pow(final.ratio, (i * final.notes + j) / final.notes);
			fontSizes.push({
				size: fontSize,
				frequency: i,
				note: j
			});
		}
	}

	return fontSizes;
};

export const mapOutput = (input, state, processed) => {
	const mapped = { asArray: processed };

	processed.forEach(item => {
		mapped[`${item.frequency}-${item.note}`] = item.size;
	});
	return mapped;
};

export const node: NodeDefinition = {
	defaults,
	type,
	process,
	mapOutput
};
