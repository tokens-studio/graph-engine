import { BaseNode } from "./base";
import { IMagickImage, MorphologySettings } from "@imagemagick/magick-wasm";
import { INodeDefinition, StringSchema, ToInput, ToOutput } from "@tokens-studio/graph-engine";
import { ImageSchema } from "../schemas";

export const morphologyMethod =  {
    Convolve: 1,
    Correlate: 2,
    Erode: 3,
    Dilate: 4,
    ErodeIntensity: 5,
    DilateIntensity: 6,
    IterativeDistance: 7,
    Open: 8,
    Close: 9,
    OpenIntensity: 10,
    CloseIntensity: 11,
    Smooth: 12,
    EdgeIn: 13,
    EdgeOut: 14,
    Edge: 15,
    TopHat: 16,
    BottomHat: 17,
    HitAndMiss: 18,
    Thinning: 19,
    Thicken: 20,
    Distance: 21,
    Voronoi: 22
} as const;


export const Kernel = {
    Unity: "Unity",
    Gaussian: "Gaussian",
    DoG: "DoG",
    LoG: "LoG",
    Blur: "Blur",
    Comet: "Comet",
    Binomial: "Binomial",
    Laplacian: "Laplacian",
    Sobel: "Sobel",
    FreiChen: "FreiChen",
    Roberts: "Roberts",
    Prewitt: "Prewitt",
    Compass: "Compass",
    Kirsch: "Kirsch",
    Diamond: "Diamond",
    Square: "Square",
    Rectangle: "Rectangle",
    Octagon: "Octagon",
    Disk: "Disk",
    Plus: "Plus",
    Cross: "Cross",
    Ring: "Ring",
    Peaks: "Peaks",
    Edges: "Edges",
    Corners: "Corners",
    Diagonals: "Diagonals",
    LineEnds: "LineEnds",
    LineJunctions: "LineJunctions",
    Ridges: "Ridges",
    ConvexHull: "ConvexHull",
    ThinSE: "ThinSE",
    Skeleton: "Skeleton",
    Chebyshev: "Chebyshev",
    Manhattan: "Manhattan",
    Octagonal: "Octagonal",
    Euclidean: "Euclidean",
    UserDefined: "UserDefined"
} as const;

export class Morphology extends BaseNode {
    static title = "Morphology";
    static type = "studio.tokens.image.morphology";

    declare inputs: ToInput<{
        image: ImageData;
        kernel: typeof Kernel;
        method: typeof morphologyMethod
    }>
    declare outputs: ToOutput<{
        image: ImageData;
    }>

    constructor(props: INodeDefinition) {
        super(props);
        this.addInput("image", {
            type: ImageSchema
        });
        this.addInput("method", {
            type: {
                ...StringSchema,
                enum: Object.keys(morphologyMethod),
                default: 'Convolve'
            }
        });
        this.addInput("kernel", {
            type: {
                ...StringSchema,
                enum: Object.keys(Kernel),
                default: 'Convolve'
            }
        });
        

        this.addOutput("image", {
            type: ImageSchema
        });
    }

    async execute() {

        const ImageMagick = this.getImageMagick();
        const { image, method,kernel } = this.getAllInputs();

        const morphMethod = morphologyMethod[method as keyof typeof morphologyMethod];
        const kernelValue = Kernel[kernel as keyof typeof Kernel];
    
        const settings = new MorphologySettings(morphMethod,kernelValue)
        await ImageMagick.read(this.cloneImage(image), (image: IMagickImage) => {
            image.morphology(settings);
            image.write((data) => this.setOutput('image', {
                data,
                settings: image.settings
            }))
        });
    }
}
