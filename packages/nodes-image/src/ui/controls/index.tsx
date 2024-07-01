import { IMAGE } from "../../schemas/index.js"
import { Image } from "./image.js";
import type { Input, Port } from "@tokens-studio/graph-engine"

export const controls = [{
    matcher: (port: Port) => {
        const inputPort = port as Input;
        return inputPort.type.$id == IMAGE
    },
    component: Image,
},
]
