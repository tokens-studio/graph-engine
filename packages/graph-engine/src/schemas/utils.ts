import { type SchemaObject } from 'ajv';

export const extractArray = (schema: SchemaObject): SchemaObject => {
	if (schema.type === 'array') {
		return schema.items;
	}
	return schema;
};

export const arrayOf = (schema: SchemaObject) => {
	return {
		type: 'array',
		items: schema
	};
};
