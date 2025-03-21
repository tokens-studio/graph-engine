import { DataflowNode } from '@/engines/dataflow/types/node.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { NumberSchema, StringSchema } from '../../schemas/index.js';




function execute(top:number | string, right:number =5, bottom:number =2, left:number =3 , value:boolean): void {
	value.set(`${top} ${right} ${bottom} ${left}`);
}



export default class NodeDefinition extends DataflowNode {
	static title = 'CSS Box';
	static type = 'studio.tokens.css.box';
	static description =
		'CSS Box node allows you to generate a CSS box from 4 values';

	declare inputs: ToInput<{
		top: number;
		right: number;
		bottom: number;
		left: number;
	}>;
	declare outputs: ToOutput<{
		value: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.addInput('top', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('right', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('bottom', {
			type: {
				...NumberSchema,
				default: 0
			}
		});
		this.addInput('left', {
			type: {
				...NumberSchema,
				default: 0
			}
		});

		this.addOutput('value', {
			type: StringSchema
		});
	}

	execute(): void | Promise<void> {
		const { top, right, bottom, left } = this.getAllInputs();
		this.outputs.value.set(`${top} ${right} ${bottom} ${left}`);
	}
}
