import { TOKEN_ARRAY, TOKEN } from "../../schemas/index.js"
import type { Port } from "@tokens-studio/graph-engine"
import { TokenArrayField } from "./tokenSet.js"
import { TokenField } from "./token.js"

export const controls = [{
    matcher: (port: Port) => port.type.$id === TOKEN_ARRAY,
    component: TokenArrayField,
},
{
    matcher: (port: Port) => port.type.$id === TOKEN,
    component: TokenField,
}]