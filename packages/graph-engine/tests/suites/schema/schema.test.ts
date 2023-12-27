import Ajv from "ajv";
import { NumberSchema, AnySchema, AnyArraySchema } from "@/schemas/index.js";
// @ts-ignore
const ajv = new Ajv({ useDefaults: true });

describe("schema", () => {
  [NumberSchema, AnySchema, AnyArraySchema].forEach((schema) => {
    it(`should validate ${schema.title}`, async () => {
      const validate = ajv.validateSchema(schema);
      expect(validate).toBe(true);
    });
  });
});
