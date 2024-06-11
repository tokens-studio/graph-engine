import { TOKEN } from "../../schemas/index.js"
import { TokenArrayField } from "./tokenSet.js"
import { TokenField } from "./token.js"
import { VariadicTokenSet } from "./variadicTokenSet.js"
import { variadicMatcher } from "@tokens-studio/graph-editor"
import type { Port } from "@tokens-studio/graph-engine"

export const controls = [{
    matcher: (port: Port) => port.type.type === 'array' && port.type.items?.$id === TOKEN,
    component: TokenArrayField,
},
{
    matcher: (port: Port) => port.type.$id === TOKEN,
    component: TokenField,
},
{
    matcher: variadicMatcher(TOKEN),
    component: VariadicTokenSet,
}
]
