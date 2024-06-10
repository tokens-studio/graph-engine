import { TOKEN, VARIADIC_TOKEN_SET } from "../../schemas/index.js"
import type { Port } from "@tokens-studio/graph-engine"
import { TokenArrayField } from "./tokenSet.js"
import { TokenField } from "./token.js"
import { VariadicTokenSet } from "./variadicTokenSet.js"

export const controls = [{
    matcher: (port: Port) => port.type.type === 'array' && port.type.items?.$id === TOKEN,
    component: TokenArrayField,
},
{
    matcher: (port: Port) => port.type.$id === TOKEN,
    component: TokenField,
},
{
    matcher: (port: Port) => port.type.$id === VARIADIC_TOKEN_SET,
    component: VariadicTokenSet,
}
]