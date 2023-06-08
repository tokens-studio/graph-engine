import { Color, blend, converter, formatHex } from 'culori';
import { NodeDefinition, NodeTypes } from '../../types.js';
import { NonEmptyArray } from 'culori/src/common.js';

const type = NodeTypes.ADVANCED_BLEND;

export type MappedInput = {
	//Array of color strings
	inputs: {
		key: string;
		value: string;
	}[];
};

export enum BlendTypes {
	NORMAL = 'normal',
	MULTIPLY = 'multiply',
	SCREEN = 'screen',
	HARD_LIGHT = 'hard-light',
	OVERLAY = 'overlay',
	DARKEN = 'darken',
	LIGHTEN = 'lighten',
	COLOR_DODGE = 'color-dodge',
	COLOR_BURN = 'color-burn',
	SOFT_LIGHT = 'soft-light',
	DIFFERENCE = 'difference',
	EXCLUSION = 'exclusion'
}
export type State = {
	/**
	 * The number for steps for the shades
	 */
	blendType: BlendTypes;
};

/**
 * Pure function
 * @param input
 * @param state
 */
export const mapInput = (input: Record<string, string>): MappedInput => {
	const vals = Object.entries(input || {}).sort((a, b) => {
		return a[0].localeCompare(b[0]);
	});
	const values = vals.map(([key, value]) => ({ key, value }));

	//Returns the expected array of inputs
	return {
		inputs: values
	} as MappedInput;
};

export const defaults: State = {
	blendType: BlendTypes.NORMAL
};

const process = (input: MappedInput, state: State) => {
	const rgb = converter('rgb');
	const cols = input.inputs.map(x => rgb(x.value)) as NonEmptyArray<Color>;

	if (cols.length < 2) {
		return undefined;
	}

	const blended = blend(cols, state.blendType);

	return {
		color: formatHex(blended),
		r: blended.r,
		g: blended.g,
		b: blended.b
	};
};

const mapOutput = (input: MappedInput, state: State, processed) => {
	return processed;
};

export const node: NodeDefinition<MappedInput, State> = {
	type,
	mapInput,
	mapOutput,
	defaults,
	process
};
