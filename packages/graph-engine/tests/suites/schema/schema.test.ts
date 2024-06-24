import {
	AnyArraySchema,
	AnySchema,
	NumberSchema
} from '../../../src/schemas/index.js';
import Ajv from 'ajv';
const ajv = new Ajv({ useDefaults: true });

describe('schema', () => {
	[NumberSchema, AnySchema, AnyArraySchema].forEach(schema => {
		it(`should validate ${schema.title}`, async () => {
			const validate = ajv.validateSchema(schema);
			expect(validate).toBe(true);
		});
	});
});
