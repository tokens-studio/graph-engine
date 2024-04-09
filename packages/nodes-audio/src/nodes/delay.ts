import { INodeDefinition, Node, NumberSchema } from "@tokens-studio/graph-engine";
import { ContextSchema, SourceSchema, DestinationSchema } from "../schemas/index.js";


type inputs = {
    context: AudioContext;
    delay: number;
    source: AudioNode | undefined;
    destination: AudioNode | undefined;
};

export class AudioDelayNode extends Node {
    static title = "Audio Delay node";
    static type = "studio.tokens.audio.delay";

    audioNode: DelayNode | undefined;

    static description =
        "Modifies an audio source to provide delay.";
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("context", {
            type: ContextSchema,
            visible: true,
        });
        this.addInput("delay", {
            type: {
                ...NumberSchema,
                default: 1,
            },
            visible: true,
        });
        this.addOutput("node", {
            visible: true,
            type: {
                ...DestinationSchema,
                description: "The created Node",
            }
        });
    }

    execute(): void | Promise<void> {

        const { context, delay } = this.getAllInputs<inputs>();

        if (!this.audioNode) {
            this.audioNode = context.createDelay(delay);
        }

        if (this.audioNode.context !== context) {
            //If we are changing contexts, disconnect from the old one and connect to the new one
            this.audioNode.disconnect();
            this.audioNode = context.createDelay(delay);
        }
        this.audioNode.delayTime.setValueAtTime(delay, 0);
        this.setOutput('node', this.audioNode);
    }
}
