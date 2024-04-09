import { INodeDefinition, Node, NumberSchema } from "@tokens-studio/graph-engine";
import { ContextSchema, DestinationSchema } from "../schemas/index.js";


export class AudioContextNode extends Node {
    static title = "Audio Context node";
    static type = "studio.tokens.audio.context";

    context: AudioContext;

    static description =
        "Creates an audio context, an audio-processing graph built from audio modules linked together, each represented by an AudioNode.";
    constructor(props: INodeDefinition) {
        super(props);
        this.context = new AudioContext();
        this.addOutput("context", {
            visible: true,
            type: {
                ...ContextSchema,
                description: "The created audio context",
            }
        });
        this.addOutput("destination", {
            visible: true,
            type: {
                ...DestinationSchema,
                description: "The destination for the audio",
            }
        });

    }

    onPause = () => {
        this.context.suspend();
    }
    onResume = () => {
        this.context.resume();
    }
    execute(): void | Promise<void> {
        this.setOutput('context', this.context);
        this.setOutput('destination', this.context.destination);
    }
}
