import { BaseNode } from "./base";
import { INodeDefinition, NumberSchema, ToInput, ToOutput } from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas";
import type { IMagickImage } from "@imagemagick/magick-wasm";


export class GaussianBlurNode extends BaseNode {
    static title = "Gaussian blur";
    static type = "studio.tokens.image.gaussianBlur";

    declare inputs: ToInput<{
        image: ImageData;
        sigma: number;
        radius: number
    }>
    declare outputs: ToOutput<{
        image: ImageData;
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("image", {
            type: ImageSchema
        });
        this.addInput("sigma", {
            type: NumberSchema
        });

        this.addInput("radius", {
            type: NumberSchema
        });


        this.addOutput("image", {
            type: ImageSchema
        });
    }

    async execute() {

        const ImageMagick = this.getImageMagick();
        const { image,sigma,radius } = this.getAllInputs();


        await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
            image.gaussianBlur(radius,sigma);
            image.write((data) => this.setOutput('image', {
                data
            }))
        });
    }
}
