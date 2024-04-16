import { INodeDefinition, Node, createVariadicSchema } from "@tokens-studio/graph-engine";
import { SourceSchema, DestinationSchema } from "../schemas/index.js";
import { AudioBaseNode } from "./base.js";


type inputs = {
    source: AudioNode[];
    destination: AudioNode;
};

export class AudioConnectNode extends AudioBaseNode {
    static title = "Audio Connect node";
    static type = "studio.tokens.audio.connect";


    static description =
        "An explicit connection between audio nodes";
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("source", {
            type:
            {
                ...createVariadicSchema(SourceSchema),
                default: [],
            },
            variadic: true,
            visible: true,
        });
        this.addInput("destination", {
            type: DestinationSchema,
            visible: true,
        });
        this.addOutput("destination", {
            type: SourceSchema,
            visible: true
        });
    }

    execute(): void | Promise<void> {

        const { destination, source } = this.getAllInputs<inputs>();

        source.map((sourceNode) => {
            sourceNode.disconnect();
            sourceNode.connect(destination);
        });

        this.setOutput('destination', destination);
    }
}
