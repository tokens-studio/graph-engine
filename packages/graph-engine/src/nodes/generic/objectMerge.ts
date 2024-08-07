import { AnySchema, StringSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { arrayOf } from '../../schemas/utils.js';
import deepMerge from '@bundled-es-modules/deepmerge';

const overwriteMerge = (_, sourceArray) => sourceArray;

const combineMerge = (target, source, options) => {
	const destination = target.slice();

	source.forEach((item, index) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepMerge(target[index], item, options);
		} else if (target.indexOf(item) === -1) {
			destination.push(item);
		}
	});
	return destination;
};

const CONCAT = 'concat';
const MERGE = 'merge';
const COMBINE = 'combine';

export default class NodeDefinition extends DataflowNode {
	static title = 'Merge objects';
	static type = 'studio.tokens.generic.mergeObjects';
	static description =
		'Merges an array of objects into a single object, with later objects taking precedence.';

	declare inputs: ToInput<{
		objects: object[];
		concatArray: 'concat' | 'merge' | 'combine';
	}>;
	declare outputs: ToOutput<{
		value: object;
	}>;

	constructor(props: INodeDefinition) {
		super(props);
		this.dataflow.addInput('objects', {
			type: {
				...arrayOf(AnySchema),
				default: []
			}
		});
		this.dataflow.addInput('concatArray', {
			type: {
				...StringSchema,
				enum: [CONCAT, MERGE, COMBINE],
				default: CONCAT
			}
		});
		this.dataflow.addOutput('value', {
			type: AnySchema
		});
	}

	execute(): void | Promise<void> {
		const { objects, concatArray } = this.getAllInputs();

		let opts = {};
		if (concatArray === MERGE) {
			opts = { arrayMerge: overwriteMerge };
		} else if (concatArray === COMBINE) {
			opts = { arrayMerge: combineMerge };
		}

		const flattened = deepMerge.all(objects, opts);
		this.outputs.value.set(flattened);
	}
}
