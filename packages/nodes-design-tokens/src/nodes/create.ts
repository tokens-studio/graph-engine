import {
  AnySchema,
  INodeDefinition,
  Node,
  StringSchema,
} from "@tokens-studio/graph-engine";
import { TOKEN_BORDER, TOKEN_BOX_SHADOW, TOKEN_TYPOGRAPHY, TokenSchema } from "../schemas/index.js";
import { TokenTypes } from "@tokens-studio/types";

const types = Object.values(TokenTypes).sort();

export default class NodeDefinition extends Node {
  static title = "Create Design Token";
  static type = "studio.tokens.design.create";
  static description = "Creates a design token from inputs";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("name", {
      type: StringSchema,
      visible: true,
    });
    this.addInput("type", {
      type: {
        ...StringSchema,
        enum: types,
      },
      visible: true,
    });
    this.addInput("value", {
      type: AnySchema,
      visible: true,
    });

		this.addOutput('token', {
			type: TokenSchema,
			visible: true
		});
	}

  execute(): void | Promise<void> {
    const props = this.getAllInputs();
    const type = props.type;
    const value = this.getRawInput('value');

    if (!type) {
      throw new Error('Type is required');
    }

    //We assume a string is always valid in the case of reference support
    if (value.type?.type !== 'string') {

      switch (value.type.$id) {
        case TOKEN_TYPOGRAPHY:
          if (type !== TokenTypes.TYPOGRAPHY) {
            throw new Error('Invalid type');
          }
          break;
        case TOKEN_BORDER:
          if (type !== TokenTypes.BORDER) {
            throw new Error('Invalid type');
          }
          break;
        default:
          //Due to the fact that the box shadow is an array we need to do a structural check for it 
          if (value.type.items?.id == TOKEN_BOX_SHADOW) {
            if (type !== TokenTypes.BOX_SHADOW) {
              throw new Error('Invalid type');
            }
            break;
          }
          throw new Error('Invalid type');
      }
    }

    this.setOutput("token", props);
  }
}
