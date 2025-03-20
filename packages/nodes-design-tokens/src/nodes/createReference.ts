import {
	INodeDefinition,
	Node,
	StringSchema,
	ToInput,
	ToOutput,
	createVariadicSchema
} from '@tokens-studio/graph-engine';

export default class CreateReferenceNode extends Node {
	static title = 'Create Reference';
	static type = 'studio.tokens.design.createReference';
	static description =
		'Creates a design token reference by joining path segments with dots and wrapping in curly braces.';

	declare inputs: ToInput<{
		segments: string[];
	}>;
	declare outputs: ToOutput<{
		reference: string;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.addInput('segments', {
			type: {
				...createVariadicSchema(StringSchema),
				default: []
			},
			variadic: true
		});

		this.addOutput('reference', {
			type: StringSchema
		});

		// Listen for edge removals on the graph
		if (props.graph) {
			props.graph.on('edgeRemoved', () => {
				this.execute();
			});
		}
	}

	execute(): void {
		// Get the current value or fall back to default empty array
		const segments = this.inputs.segments.value ?? [];

		// Always set the output, even if empty
		const reference = segments.length > 0 ? `{${segments.join('.')}}` : '';

		// Ensure we always set the output value
		this.outputs.reference.set(reference);
	}
}
