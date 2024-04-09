import { INodeDefinition, ToInput, Node, NumberSchema, StringSchema } from "@tokens-studio/graph-engine";
import { ContextSchema, SourceSchema } from "../schemas/index.js";


type inputs = {
    context: AudioContext;
    /**
     * A string for the uri of the audio source
     */
    audioSource: string
};


export class AudioSourceNode extends Node {
    static title = "Audio Source node";
    static type = "studio.tokens.audio.source";

    audioNode: AudioBufferSourceNode | undefined;
    loaded = false;
    memoizedSource = "";



    declare inputs: ToInput<inputs>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("context", {
            type: ContextSchema,
            visible: true,
        });
        this.addInput("audioSource", {
            type: StringSchema
        });
        this.addOutput("node", {
            type: {
                ...SourceSchema,
                description: "The generated oscillator node",
            },
            visible: true,
        });
    }

    async execute(): Promise<void> {

        const { context, audioSource } = this.getAllInputs<inputs>();

        if (!this.audioNode) {
            this.audioNode = context.createBufferSource();
        }

        if (!this.loaded || audioSource != this.memoizedSource) {
            const audioFile = await this.getGraph().loadResource(audioSource, this);

            const buffer = await context.decodeAudioData(audioFile);

            this.audioNode.buffer = buffer;
            this.loaded = true;
            this.memoizedSource = audioSource;
        }

        this.setOutput('node', this.audioNode);
    }

    onStart = () => {
        this.audioNode?.start();
    }
    onStop = () => {
        this.audioNode?.stop();
    }

}
