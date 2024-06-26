

import { BaseNode } from "./base";
import { IMagickImage } from "@imagemagick/magick-wasm";
import { INodeDefinition, ToInput } from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas";

export class FlopNode extends BaseNode {
    static title = "Flip Horizontal";
    static type = "studio.tokens.image.flop";

    declare inputs: ToInput<{
        image: ImageData;
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("image", {
            type: ImageSchema,
        });
        this.addOutput("image", {
            type: ImageSchema,
        });
    }

    async execute() {
        const ImageMagick = this.getImageMagick();
        const { image } = this.getAllInputs();


        await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
            image.flop();
            image.write((data) => this.setOutput('image', {
                data
            }))
        });
    }
}
