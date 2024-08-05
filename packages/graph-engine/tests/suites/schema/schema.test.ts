import {
	AnyArraySchema,
	AnySchema,
	NumberSchema
} from '@/schemas/index.js';
import { describe, expect, test } from 'vitest';
import ZSchema from 'z-schema-esm';

const zschema = new ZSchema();

describe('schema', () => {
	[NumberSchema, AnySchema, AnyArraySchema].forEach(schema => {
		test(`should validate ${schema.title}`, async () => {
			const validate = zschema.validateSchema(schema);
			expect(validate).to.be.true;
		});
	});
});
