import { SecretCapability } from "../../capabilities/secret.js";
import { Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas";

export default class NodeDefinition extends Node {
    static title = "Retrieve Secret";
    static type = 'studio.tokens.secret.retrieve';

    static description = "Retrieves a secret";

    //Requires the secret capability
    static annotations = {
        'engine.capability.secret': true
    }

    constructor(props) {
        super(props);

        this.addInput("secret", {
            type: StringSchema,
            visible: true
        });
        this.addInput("key", {
            type: StringSchema
        });
        this.addOutput('value', {
            type: StringSchema,
            visible: true,
        });
    }
    async execute() {
        const { secret, key } = this.getAllInputs();

        const secretCapability = this.getGraph().capabilities['secret'] as SecretCapability;

        const value = await secretCapability.getSecret({ secret, key });

        this.setOutput("value", value);
    }
}
