import {
	ControlFlow,
	IControlFlowNode
} from '@/programmatic/nodes/controlflow.js';
import {
	Dataflow,
	IDataflowNode,
	INodeDefinition,
	StringSchema,
	ToInput,
	annotatedNodeRunning
} from '../../index.js';
import { Node } from '../../programmatic/nodes/node.js';
import { ToControlInput } from '@/programmatic/controlflow/input.js';
import { ToControlOutput } from '@/programmatic/controlflow/output.js';
import axios from 'axios';

/**
 * A node that passes through the input to the output.
 */
export default class NodeDefinition
	extends Node
	implements IControlFlowNode, IDataflowNode
{
	controlflow = new ControlFlow(this);
	dataflow = new Dataflow(this);

	static title = 'Anthropic';
	static type = 'studio.tokens.network.anthropic';
	static description = 'Does a call to the Anthropic API';

	declare inputs: ToControlInput<{
		message: string;
	}> &
		ToInput<{
			apiKey: string;
			model: string;
		}>;
	declare outputs: ToControlOutput<{
		value: string;
	}>;

	_interval: NodeJS.Timer | null = null;
	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('apiKey', {
			type: StringSchema
		});

		this.dataflow.addInput('model', {
			type: {
				...StringSchema,
				default: 'claude-3-opus-20240229'
			}
		});

		this.controlflow.addInput('message', async msg => {
			const { model, apiKey } = this.getAllInputs();

			this.setAnnotation(annotatedNodeRunning, true);
			const res = await axios.post(
				'https://api.anthropic.com/v1/messages',
				{
					model,
					max_tokens: 1024,
					messages: [{ role: 'user', content: msg }]
				},
				{
					headers: {
						'Access-Control-Allow-Origin': '*',
						'x-api-key': apiKey,
						'anthropic-version': '2023-06-01',
						'content-type': 'application/json'
					}
				}
			);
			this.setAnnotation(annotatedNodeRunning, false);

			this.outputs.value.trigger(res.data.content[0].text, StringSchema);
		});

		this.controlflow.addOutput('value', {
			type: StringSchema
		});
	}
	execute() {}
}
