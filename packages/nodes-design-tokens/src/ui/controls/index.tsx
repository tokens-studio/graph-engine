import { TOKEN_ARRAY, TOKEN } from "@/schemas"
import type { Port } from "@tokens-studio/graph-engine"
import { TokenArrayField } from "./tokenSet"
import { TokenField } from "./token"

export const controls = [{
    matcher: (port: Port) => port.type.$id === TOKEN_ARRAY,
    component: TokenArrayField,
},
{
    matcher: (port: Port) => port.type.$id === TOKEN,
    component: TokenField,
}]