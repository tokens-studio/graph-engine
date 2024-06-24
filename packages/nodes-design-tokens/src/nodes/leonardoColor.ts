import {
	BooleanSchema,
	ColorSchema,
	INodeDefinition,
	Node,
	NumberSchema,
	StringSchema
} from '@tokens-studio/graph-engine';
import { LeonardoColorSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class LeonardoColorNode extends Node {
	static title = 'Leonardo Color';
	static type = 'studio.tokens.design.leonardo.color';
	static description = 'Creates a leonardo color';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('name', {
			type: StringSchema,
			visible: true
		});
		this.addInput('colorKeys', {
			type: arrayOf(ColorSchema),
			visible: true
		});
		this.addInput('ratios', {
			type: arrayOf(NumberSchema),
			visible: true
		});

		this.addInput('smooth', {
			type: BooleanSchema
		});
		this.addOutput('value', {
			type: LeonardoColorSchema,
			visible: true
		});
	}

	execute(): void | Promise<void> {
		const { name, colorKeys, ratios, smooth } = this.getAllInputs();

		//Because the color is mutated inside of the object, we create a plain object and expect downstream nodes to handle the mutation
		const color = {
			name,
			colorKeys,
			ratios,
			smooth
		};
		this.setOutput('value', color);
	}
}
