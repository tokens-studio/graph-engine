import { Node } from "../../programmatic/node.js";

/**
 * @example
 * 
 * ```json
 * {"nodes":[{"id":"be2be49c-3c7f-4f6a-a175-d44c7318e7a0","type":"studio.tokens.generic.note","inputs":[],"annotations":{"ui.position.x":-569.453229296693,"ui.position.y":484.6400208706624,"ui.nodeType":"studio.tokens.generic.note","ui.description":"Notes can be used to store arbitrary information in your graph. \n\nNote you can also store information directly in the `ui.description` annotation property of any node"}}],"edges":[],"annotations":{"engine.id":"b320d136-53d8-4683-8d6a-359caa44fdf0","engine.capabilities.web-audio":"0.0.0","engine.capabilities.fs":"0.0.0","engine.version":"0.12.0","ui.viewport":{"x":909.6901824036067,"y":-89.57980497538804,"zoom":0.8587414984357615},"ui.version":"2.9.4"}}
 * ```
 */
export default class NodeDefinition extends Node {
    static title = "Note";
    static type = "studio.tokens.generic.note";

    static description =
        "Adds a comment or note to your node graph.\n\nNo inputs or outputs\n\nUse this node to add explanations, reminders, or documentation directly in your node graph. It doesn't affect the data flow but helps in organizing and understanding complex workflows. Essential for collaboration, self-documentation, and maintaining clarity in your projects.";

}
