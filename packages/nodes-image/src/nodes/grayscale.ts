import { BaseNode } from "./base";
import { INodeDefinition, ToInput, ToOutput } from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas";
import type { IMagickImage } from "@imagemagick/magick-wasm";


export class GrayscaleNode extends BaseNode {
    static title = "Grayscale";
    static type = "studio.tokens.image.grayscale";

    declare inputs: ToInput<{
        image: ImageData;
    }>
    declare outputs: ToOutput<{
        image: ImageData;
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("image", {
            type: ImageSchema
        });

        this.addOutput("image", {
            type: ImageSchema
        });
    }

    async execute() {

        const ImageMagick = this.getImageMagick();
        const { image } = this.getAllInputs();
        
        await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
            image.grayscale();

            image.write((data) => this.setOutput('image', {
                data,
                settings: image.settings
            }))
        });
    }
}
