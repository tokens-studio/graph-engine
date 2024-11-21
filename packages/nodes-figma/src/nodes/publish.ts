import {
  BooleanSchema,
  INodeDefinition,
  Node,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { TokenSchema } from "@tokens-studio/graph-engine-nodes-design-tokens";

export default class NodeDefinition extends Node {
  static title = "Publish Variable";
  static type = "studio.tokens.figma.publish";
  static description = "Controls whether a variable is published to Users";

  declare inputs: ToInput<{
    token: SingleToken;
    publish: boolean;
  }>;
  declare outputs: ToOutput<{
    token: SingleToken;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("token", {
      type: {
        ...TokenSchema,
        description: "The design token to control publishing for",
      },
    });

    this.addInput("publish", {
      type: {
        ...BooleanSchema,
        default: true,
        description: "Whether to publish this token to Figma",
      },
    });

    this.addOutput("token", {
      type: TokenSchema,
    });
  }

  execute(): void | Promise<void> {
    const { token, publish } = this.getAllInputs();

    // Get existing Figma extension
    const existingFigmaExt = token.$extensions?.["com.figma"] || {};

    // Create the modified token with inverted publish value
    const modifiedToken = {
      ...token,
      $extensions: {
        ...token.$extensions,
        "com.figma": {
          ...existingFigmaExt,
          hiddenFromPublishing: !publish,
        },
      },
    };

    this.outputs.token.set(modifiedToken);
  }
}
