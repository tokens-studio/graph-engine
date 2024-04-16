import { INodeDefinition, Node, NumberSchema, ToInput } from "@tokens-studio/graph-engine";
import { ContextSchema, SourceSchema, NodeSchema } from "../schemas/index.js";
import { AudioBaseNode } from "./base.js";



type inputs = {
    delay: number;
    input: AudioNode | undefined;
};

export class AudioDelayNode extends AudioBaseNode {
    static title = "Audio Delay node";
    static type = "studio.tokens.audio.delay";

    audioNode: DelayNode | undefined;
    _last: AudioNode | undefined;

    declare inputs: ToInput<inputs>
    static description =
        "Modifies an audio source to provide delay.";
    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("delay", {
            type: {
                ...NumberSchema,
                default: 1,
                minimum: 1,
                maximum: 180,
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
                description: "The created Node",
            }
        });
    }

    execute(): void | Promise<void> {

        const context = this.getAudioCtx();
        const { input, delay } = this.getAllInputs<inputs>();

        if (!this.audioNode) {
            this.audioNode = context.createDelay(delay);
        }

        if (this._last) {
            this._last.disconnect(this.audioNode!);
            this._last = undefined;
        }

        if (input) {
            input.connect(this.audioNode);
            this._last = input;
        }

        this.audioNode.delayTime.setValueAtTime(delay, context.currentTime);
        this.setOutput('node', this.audioNode);
    }
}
