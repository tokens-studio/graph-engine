import {
  INodeDefinition,
  Node,
  StringSchema,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";
import { SingleToken } from "@tokens-studio/types";
import { TokenSchema } from "@tokens-studio/graph-engine-nodes-design-tokens";
import { mergeTokenExtensions } from "../utils/tokenMerge.js";

export default class NodeDefinition extends Node {
  static title = "Code Syntax";
  static type = "studio.tokens.figma.codeSyntax";
  static description = "Defines code syntax for different platforms in Figma";

  declare inputs: ToInput<{
    token: SingleToken;
    web: string;
    android: string;
    ios: string;
  }>;
  declare outputs: ToOutput<{
    token: SingleToken;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("token", {
      type: {
        ...TokenSchema,
        description: "The design token to add code syntax to",
      },
    });

    this.addInput("web", {
      type: {
        ...StringSchema,
        default: "",
        description: "Web platform code syntax",
      },
    });

    this.addInput("android", {
      type: {
        ...StringSchema,
        default: "",
        description: "Android platform code syntax",
      },
    });

    this.addInput("ios", {
      type: {
        ...StringSchema,
        default: "",
        description: "iOS platform code syntax",
      },
    });

    this.addOutput("token", {
      type: TokenSchema,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();

    const codeSyntax = {
      ...(inputs.web && { Web: inputs.web }),
      ...(inputs.android && { Android: inputs.android }),
      ...(inputs.ios && { iOS: inputs.ios }),
    };

    const modifiedToken = mergeTokenExtensions(inputs.token, {
      hiddenFromPublishing: false,
      codeSyntax,
    });

    this.outputs.token.set(modifiedToken);
  }
}
