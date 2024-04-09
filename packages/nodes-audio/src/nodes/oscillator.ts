import { INodeDefinition, ToInput, Node, NumberSchema, StringSchema } from "@tokens-studio/graph-engine";
import { ContextSchema, SourceSchema } from "../schemas/index.js";


type inputs = {
    context: AudioContext;
    type: string;
    frequency: number
};


export class AudioOscillatorNode extends Node {
    static title = "Audio Oscillator node";
    static type = "studio.tokens.audio.oscillator";

    oscillatorNode: OscillatorNode | undefined;


    declare inputs: ToInput<inputs>


    static description =
        "Creates an oscillator node, a source representing a periodic waveform. It basically generates a constant tone.";
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("context", {
            type: ContextSchema,
            visible: true,
        });
        this.addInput("type", {
            type: {
                ...StringSchema,
                enum: ["sawtooth", "sine", "square", "triangle"],
                default: "sine",
            },
        });
        this.addInput("frequency", {
            type: {
                ...NumberSchema,
                default: 3000,
            },
        });
        this.addOutput("node", {
            type: {
                ...SourceSchema,
                description: "The generated oscillator node",
            },
            visible: true,
        });
    }

    execute(): void | Promise<void> {

        const { context, type, frequency } = this.getAllInputs<inputs>();

        if (!this.oscillatorNode) {
            this.oscillatorNode = context.createOscillator();
        }

        this.oscillatorNode.type = type as OscillatorType;

        this.oscillatorNode.frequency.setValueAtTime(frequency, context.currentTime);

        this.setOutput('node', this.oscillatorNode);
    }

    onStart = () => {
        this.oscillatorNode?.start();
    }
    onStop = () => {
        this.oscillatorNode?.stop();
    }

}
