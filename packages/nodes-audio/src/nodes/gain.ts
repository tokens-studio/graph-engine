import { INodeDefinition, Node, NumberSchema } from "@tokens-studio/graph-engine";
import { ContextSchema, SourceSchema, DestinationSchema } from "../schemas/index.js";


type inputs = {
    context: AudioContext;
    gain: number;
    source: AudioNode | undefined;
    destination: AudioNode | undefined;
};

export class AudioGainNode extends Node {
    static title = "Audio Gain node";
    static type = "studio.tokens.audio.gain";

    gainNode: GainNode | undefined;

    static description =
        "Modifies an audio source to provide a gain (volume) control.";
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("context", {
            type: ContextSchema,
            visible: true,
        });
        this.addInput("gain", {
            type: {
                ...NumberSchema,
                default: 1,
            },
            visible: true,
        });
        this.addOutput("node", {
            visible:true,
            type: {
                ...DestinationSchema,
                description: "The created gain Node",
            }
        });
    }

    execute(): void | Promise<void> {

        const { context, gain } = this.getAllInputs<inputs>();

        if (!this.gainNode) {
            this.gainNode = context.createGain();
        }

        if (this.gainNode.context !== context) {
            //If we are changing contexts, disconnect from the old one and connect to the new one
            this.gainNode.disconnect();
            this.gainNode = context.createGain();
        }
        this.gainNode.gain.setValueAtTime(gain, 0);
        this.setOutput('node', this.gainNode);
    }
}
