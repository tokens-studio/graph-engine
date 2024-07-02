import { AnySchema, BooleanSchema, ColorSchema, NumberSchema, ObjectSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export default class ObjectPathExtractorNode extends Node {
  static title = "Object Path Extractor";
  static type = "studio.tokens.object.pathExtractor";
  static description = "Extracts a value from an object using a specified path string and infers its type.";

  declare inputs: ToInput<{
    object: Record<string, any>;
    path: string;
  }>;

  declare outputs: ToOutput<{
    value: any;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    
    this.addInput("object", {
      type: ObjectSchema,
    });
    this.addInput("path", {
      type: StringSchema,
    });

    this.addOutput("value", {
      type: AnySchema,
    });
  }

  execute(): void | Promise<void> {
    const { object, path } = this.getAllInputs();

    const value = this.getValueByPath(object, path);
    const inferredType = this.inferType(value);

    this.setOutput("value", value, inferredType);
  }

  private getValueByPath(obj: Record<string, any>, path: string): any {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result === null || result === undefined) {
        return undefined;
      }

      if (key.includes('[') && key.includes(']')) {
        const [arrayKey, indexStr] = key.split('[');
        const index = parseInt(indexStr.replace(']', ''), 10);
        
        result = result[arrayKey]?.[index];
      } else {
        result = result[key];
      }
    }

    return result;
  }

  private inferType(value: any): any {
    if (typeof value === 'string') {
      // Check if it's a color (hex, rgb, rgba, hsl, hsla)
      if (/^#([0-9A-F]{3}){1,2}$/i.test(value) || 
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(value) ||
          /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(value) ||
          /^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/i.test(value) ||
          /^hsla\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*[\d.]+\s*\)$/i.test(value)) {
        return ColorSchema;
      }
      return StringSchema;
    }
    if (typeof value === 'number') {
      return NumberSchema;
    }
    if (typeof value === 'boolean') {
      return BooleanSchema;
    }
    if (Array.isArray(value)) {
      return { type: 'array', items: AnySchema };
    }
    if (typeof value === 'object' && value !== null) {
      return ObjectSchema;
    }
    return AnySchema;
  }
}