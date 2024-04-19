import { INodeDefinition, Node, NumberSchema, ToInput } from "@tokens-studio/graph-engine";
import { ContextSchema, NodeSchema } from "../schemas/index.js";
import { AudioBaseNode } from "./base.js";


type inputs = {
    gain: number;
    input: AudioNode | undefined;
};

export class AudioGainNode extends AudioBaseNode {
    static title = "Audio Gain node";
    static type = "studio.tokens.audio.gain";

    gainNode: GainNode | undefined;
    _last: AudioNode | undefined;

    declare inputs: ToInput<inputs>
    static description =
        "Modifies an audio source to provide a gain (volume) control.";
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("gain", {
            type: {
                ...NumberSchema,
                default: 1,
                minimum: 0,
                maximum: 1,
            },
            visible: true,
            annotations: {
                'ui.control': 'slider'
            }
        });
        this.addInput("input", {
            type: NodeSchema,
            visible: true,
        });

        this.addOutput("node", {
            visible: true,
            type: {
                ...NodeSchema,
                description: "The created gain Node",
            }
        });
    }

    execute(): void | Promise<void> {

        const { gain, input } = this.getAllInputs<inputs>();

        const context = this.getAudioCtx();

        if (!this.gainNode) {
            this.gainNode = context.createGain();
        }

        this.gainNode.gain.setValueAtTime(gain, 0);

        if (this._last) {
            this._last.disconnect(this.gainNode!);
            this._last = undefined;
        }

        if (input) {
            input.connect(this.gainNode!);
            this._last = input;
        }

        this.setOutput('node', this.gainNode);
    }
}