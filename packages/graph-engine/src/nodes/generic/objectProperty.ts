import { AnySchema, BooleanSchema, StringSchema } from '../../schemas/index.js';
import { DataflowNode } from '@/programmatic/nodes/dataflow.js';
import { INodeDefinition } from '../../programmatic/nodes/node.js';
import { SchemaObject } from 'ajv';
import { ToInput } from '../../programmatic/dataflow/input.js';
import { ToOutput } from '../../programmatic/dataflow/output.js';

function getSchemaByPath(schema: SchemaObject, path: string) {
	// Remove the leading dot if present
	if (path.startsWith('.')) {
		path = path.slice(1);
	}

	// Split the path by dots
	const keys = path.split('.');
	// Traverse the schema using the keys
	let currentSchema = schema;
	for (const key of keys) {
		if (currentSchema.type === 'object' && currentSchema.properties) {
			currentSchema = currentSchema.properties[key];
		} else {
			// If the path does not match the schema structure, return undefined
			return undefined;
		}
	}

	return currentSchema;
}

function getNestedProperty(obj: object, path: string) {
	// Remove the leading dot if present
	if (path.startsWith('.')) {
		path = path.slice(1);
	}

	// Split the path by dots
	const keys = path.split('.');

	// Traverse the object using the keys
	return keys.reduce((acc, key) => acc && acc[key], obj);
}

export default class NodeDefinition extends DataflowNode {
	static title = 'Object Path';
	static type = 'studio.tokens.generic.objectPath';
	static description = 'Accesses an object at a given path.';

	declare inputs: ToInput<{
		object: object;
		path: string;
	}>;
	declare outputs: ToOutput<{
		value: any;
		missing: boolean;
	}>;

	constructor(props: INodeDefinition) {
		super(props);

		this.dataflow.addInput('object', {
			type: AnySchema
		});

		this.dataflow.addInput('path', {
			type: StringSchema
		});

		this.dataflow.addOutput('value', {
			type: AnySchema
		});

		this.dataflow.addOutput('missing', {
			type: BooleanSchema
		});
	}

	execute(): void | Promise<void> {
		const object = this.inputs.object;
		const path = this.inputs.path;

		if (!path.value) {
			this.outputs.missing.set(true);
			throw new Error('Path is required');
		}

		//Attempt to access the object at the given path
		const property = getNestedProperty(object.value, path.value);
		const schema = getSchemaByPath(object.type, path.value);

		this.outputs.value.set(property, schema);
		this.outputs.missing.set(property == undefined);
	}
}
