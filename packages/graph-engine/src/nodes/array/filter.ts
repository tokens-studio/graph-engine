import {
	AnyArraySchema,
	AnySchema,
	BooleanSchema,
	NumberSchema
} from '../../schemas/index.js';
import { Graph } from '../../graph/graph.js';
import {
	INodeDefinition,
	ISubgraphContainer,
	Node
} from '../../programmatic/node.js';
import { Input, ToInput, ToOutput } from '../../programmatic/index.js';
import {
	annotatedDeleteable,
	annotatedDynamicInputs,
	hideFromParentSubgraph
} from '../../annotations/index.js';
import { autorun } from 'mobx';
import { extractArray } from '../../schemas/utils.js';
import InputNode from '../generic/input.js';
import OutputNode from '../generic/output.js';

export interface IArraySubgraph extends INodeDefinition {
	innerGraph?: Graph;
}

export default class ArraySubgraph<T>
	extends Node
	implements ISubgraphContainer
{
	static readonly title = 'Array filter';
	static readonly type = 'tokens.studio.array.filter';
	static readonly description =
		"Execute a graph for every item in an Array (list of items). The output is equal to or smaller than the input graph. The inner graph is executed for each item in the array (list). The inner graph automatically has an input node with the name 'value' and an output node with the name 'match' as well. The inner graph also has an input node with the name 'index' and an input node with the name 'length' to get the current index and length of the array.";

	_innerGraph: Graph;

	declare inputs: ToInput<{
		array: T[];
	}>;

	declare outputs: ToOutput<{
		value: T[];
	}>;

	constructor(props: IArraySubgraph) {
		super(props);

		const existing = !!props.innerGraph;
		this._innerGraph = props.innerGraph || new Graph();

		let input: InputNode;

		if (!existing) {
			//Pass capabilities down
			this._innerGraph.capabilities = this.getGraph().capabilities;

			input = new InputNode({ graph: this._innerGraph });
			input.annotations[annotatedDeleteable] = false;
			const output = new OutputNode({ graph: this._innerGraph });
			output.annotations[annotatedDeleteable] = false;
			//Do not allow additional inputs to be added
			delete output.annotations[annotatedDynamicInputs];

			//Create the initial input and output nodes
			this._innerGraph.addNode(input);
			this._innerGraph.addNode(output);

			input.annotations[annotatedDynamicInputs] = true;

			output.addInput('matches', {
				type: BooleanSchema,
				visible: true
			});

			input.addInput('value', {
				type: AnySchema,
				visible: false,
				annotations: {
					'ui.editable': false,
					'ui.hidden': true,
					[hideFromParentSubgraph]: true
				}
			});

			//Do not allow these to be edited
			input.addInput('index', {
				type: NumberSchema,
				visible: false,
				annotations: {
					'ui.editable': false,
					[hideFromParentSubgraph]: true
				}
			});

			input.addInput('length', {
				type: NumberSchema,
				visible: false,
				annotations: {
					'ui.editable': false,
					[hideFromParentSubgraph]: true
				}
			});
		} else {
			input = Object.values(this._innerGraph.nodes).find(
				x => x.factory.type == InputNode.type
			) as InputNode;
			if (!input) throw new Error('No input node found');
		}

		//Attach listeners
		autorun(() => {
			//Get the existing inputs
			const existing = this.inputs;
			const existingKeys = Object.keys(existing);
			//Iterate through the inputs of the input node in the inner graph
			Object.entries(input.inputs).forEach(([key, value]) => {
				//If the key doesn't exist in the existing inputs, add it
				if (!existing[key] && !value.annotations[hideFromParentSubgraph]) {
					//Always add it as visible
					this.addInput(key, {
						type: value.type,
						visible: true
					});
					this.inputs[key].setValue(value.value, {
						noPropagate: true
					});
				} else {
					//Note its possible that the input key still does not exist due to an annotation ,etc
					//Update the value
					this.inputs[key]?.setValue(value.value, {
						noPropagate: true
					});
				}
			});
			//If there is an existingKey that is not in the input node, remove it
			existingKeys.forEach(key => {
				//Array key is special and will never be present on the inner input node
				if (!input.inputs[key] && key !== 'array') {
					this.inputs[key]._edges.forEach(edge => {
						this.getGraph().removeEdge(edge.id);
					});
					delete this.inputs[key];
				}
			});
		});

		this.addInput('array', {
			type: AnyArraySchema,
			visible: true
		});

		this.inputs['array'].annotations['ui.editable'] = false;

		this.addOutput('value', {
			type: AnyArraySchema,
			visible: true
		});
	}

	async execute() {
		const input = this.inputs.array;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const otherInputs: [string, Input<any>][] = Object.keys(this.inputs)
			.filter(x => x !== 'array')
			.map(x => [x, this.inputs[x]]);
		const other = Object.fromEntries(
			otherInputs.map(([name, x]) => [
				name,
				{
					value: x.value,
					type: x.type
				}
			])
		);

		//Todo optimize this to run in parallel. We have to run this in series because the inner graph is not designed to run in parallel
		const itemType = extractArray(input.type);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const output = await (input.value as any[]).reduce(async (acc, item, i) => {
			const output = await acc;
			const result = await this._innerGraph.execute({
				//By default this is any so we need to overwrite it with its runtime type
				inputs: {
					value: {
						value: item,
						type: itemType
					},
					length: {
						value: input.value.length
					},
					index: {
						value: i
					},
					...other
				}
			});

			if (!result.output) throw new Error('No output from subgraph');

			if (result.output.matches.value === true) {
				output.push(item);
			}
			return output;
		}, Promise.resolve([]));

		this.outputs.value.set(output, input.type);
	}

	override serialize() {
		const serialized = super.serialize();
		return {
			...serialized,
			innergraph: this._innerGraph.serialize()
		};
	}

	static override async deserialize(opts) {
		const innerGraph = await new Graph().deserialize(
			opts.serialized.innergraph,
			opts.lookup
		);
		const node = super.deserialize({
			...opts,
			innerGraph
		});
		return node;
	}

	getSubgraphs(): Graph[] {
		return [this._innerGraph];
	}

	getGraphProperties(): Record<string, Graph | undefined> {
		return { _innerGraph: this._innerGraph };
	}
}
