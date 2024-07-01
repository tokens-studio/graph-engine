

import { BaseNode } from "./base";
import { IMagickImage } from "@imagemagick/magick-wasm";
import { INodeDefinition, ToInput } from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas";

export class SolarizeNode extends BaseNode {
    static title = "Solarize";
    static type = "studio.tokens.image.solarize";

    declare inputs: ToInput<{
        image: ImageData
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
            image.solarize();
            image.write((data) => this.setOutput('image', {
                data
            }))
        });
    }
}
