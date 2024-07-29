import { IExample } from '@/types/IExample.tsx';
import { SerializedGraph } from '@tokens-studio/graph-engine';
import audio from './audio.json';
import basic from './basic.json';
import colorCurves from './colorCurves.json';
import colorScale from './colorScale.json';
import dynamicNaming from './dynamicNaming.json';
import dynamicValidation from './dynamicValidation.json';
import leonardo from './leonardo.json';
import typescale from './typescale.json';

export const examples: IExample[] = [
	{
		title: 'Basic',
		description: 'The simplest possible example. An input and output.',
		file: basic as unknown as SerializedGraph,
		key: 'basic'
	},

	{
		title: 'Design Tokens - Color scale',
		description: 'A configurable color scale to design tokens generator',
		file: colorScale as unknown as SerializedGraph,
		key: 'colorScale'
	},
	{
		title: 'Design Tokens - Dynamic Naming',
		description: 'Shows an example with dynamic naming ',
		file: dynamicNaming as unknown as SerializedGraph,
		key: 'dynamicNaming'
	},
	{
		title: 'Design Tokens - Typescales',
		description: 'Create pleasing typescales with a few inputs',
		file: typescale as unknown as SerializedGraph,
		key: 'typescale'
	},
	{
		title: 'Colors - Color curves',
		description: 'Generate colors using curve sampling',
		file: colorCurves as unknown as SerializedGraph,
		key: 'colorCurves'
	},
	{
		title: 'Inputs - Dynamic Validation',
		description: 'Handling dynamic validation of inputs',
		file: dynamicValidation as unknown as SerializedGraph,
		key: 'dynamicValidation'
	},
	{
		title: 'Color - Adobe Leonardo',
		description: 'Leonardo themeing',
		file: leonardo as unknown as SerializedGraph,
		key: 'adobeLeonardo'
	},
	{
		title: 'Audio - Oscillator',
		description: 'A basic audio oscillator setup',
		file: audio as unknown as SerializedGraph,
		key: 'audio'
	}
];
