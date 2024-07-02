import { AnySchema, ObjectSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export default class ObjectPathExtractorNode extends Node {
  static title = "Object Path Extractor";
  static type = "studio.tokens.object.pathExtractor";
  static description = "Extracts a value from an object using a specified path string.";

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

    this.setOutput("value", value);
  }

  private getValueByPath(obj: Record<string, any>, path: string): any {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result === null || result === undefined) {
        return undefined;
      }

      // Handle array indexing
      if (key.includes('[') && key.includes(']')) {
        const [arrayKey, indexStr] = key.split('[');
        const index = parseInt(indexStr.replace(']', ''), 10);
        
        result = result[arrayKey]?.[index];
      } else {
        result = result[key];
      }
    }

    return result;
    //
  }
}