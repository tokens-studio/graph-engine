import { BackgroundColor, Color, Theme } from '@adobe/leonardo-contrast-colors';
import {
	ColorSchema,
	Color as ColorType,
	DataflowNode,
	INodeDefinition,
	NumberSchema,
	ToInput,
	ToOutput,
	hexToColor
} from '@tokens-studio/graph-engine';
import { LeonardoColor } from './leonardoColor.js';
import { LeonardoColorSchema } from '../schemas/index.js';
import { arrayOf } from '../schemas/utils.js';

export default class LeonardoThemeNode extends DataflowNode {
	static title = 'Leonardo Theme';
	static type = 'studio.tokens.design.leonardo.theme';
	static description = 'Creates a leonardo theme';
	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('colors', {
			type: arrayOf(LeonardoColorSchema)
		});
		this.addInput('contrast', {
			type: NumberSchema
		});
		this.addInput('lightness', {
			type: NumberSchema
		});
		this.addInput('saturation', {
			type: NumberSchema
		});
		this.addInput('backgroundColor', {
			type: LeonardoColorSchema
		});

		this.addOutput('colors', {
			type: arrayOf(ColorSchema)
		});
	}

	declare inputs: ToInput<{
		colors: LeonardoColor[];
		contrast: number;
		lightness: number;
		saturation: number;
		backgroundColor: LeonardoColor;
	}>;
	declare outputs: ToOutput<{
		colors: ColorType[];
	}>;

	execute(): void | Promise<void> {
		const { backgroundColor, colors, contrast, saturation, lightness } =
			this.getAllInputs();

		const theme = new Theme({
			colors: colors.map(x => new Color(x)),
			contrast,
			saturation,
			backgroundColor: new BackgroundColor(backgroundColor),
			lightness
		});

		const themeColors = theme.contrastColorValues.map(x => hexToColor(x));

		this.outputs.colors.set(themeColors);
	}
}
