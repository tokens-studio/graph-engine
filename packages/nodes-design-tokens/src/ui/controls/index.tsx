import { TOKEN_ARRAY } from "@/schemas"
import type { Port } from "@tokens-studio/graph-engine"
import { TokenArrayField } from "./tokenSet"

export const controls = [{
    matcher: (port: Port) => port.type.$id === TOKEN_ARRAY,
    component: TokenArrayField,
}]