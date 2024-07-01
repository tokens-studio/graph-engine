import { BaseNode } from "./base";
import { BooleanSchema, INodeDefinition, NumberSchema, StringSchema, ToInput, ToOutput } from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas";
import type { IMagickImage } from "@imagemagick/magick-wasm";


export class ImageProperties extends BaseNode {
    static title = "Properties";
    static type = "studio.tokens.image.properties";

    declare inputs: ToInput<{
        image: ImageData;
        width: number;
        height: number;
        channelCount: number;
        format: string;
        gamma: number;
        hasAlpha: boolean;
        quality: number;
        
    }>
    declare outputs: ToOutput<{
        image: ImageData;
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("image", {
            type: ImageSchema
        });

        this.addOutput("width", {
            type: NumberSchema
        });
        this.addOutput("height", {
            type: NumberSchema
        });
        this.addOutput("channelCount", {
            type: NumberSchema
        });
        this.addOutput("format", {
            type: StringSchema
        });
        this.addOutput("gamma", {
            type: NumberSchema
        });
        this.addOutput("hasAlpha", {
            type: BooleanSchema
        });
        this.addOutput("quality", {
            type: NumberSchema
        });
         
    }


    async execute() {

        const ImageMagick = this.getImageMagick();
        const { image } = this.getAllInputs();

        //No need to clone as this is a readonly operation
        await ImageMagick.read(image.data, (image: IMagickImage) => {
            

            this.setOutput('width',image.width);
            this.setOutput('height',image.height);
            this.setOutput('channelCount', image.channelCount);
            this.setOutput('format', image.format);
            this.setOutput('gamma', image.gamma);
            this.setOutput('hasAlpha', image.hasAlpha);
            this.setOutput('quality', image.quality);
        });
    }
}
