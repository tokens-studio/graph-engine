import {
	AnyArraySchema,
	AnySchema,
	NumberSchema
} from '../../../src/schemas/index.js';
import { expect } from 'chai';
import ZSchema from 'z-schema-esm';

const zschema = new ZSchema();

describe('schema', () => {
	[NumberSchema, AnySchema, AnyArraySchema].forEach(schema => {
		it(`should validate ${schema.title}`, async () => {
			const validate = zschema.validateSchema(schema);
			expect(validate).to.be.true;
		});
	});
});
