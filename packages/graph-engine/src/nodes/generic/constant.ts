import { AnySchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
/**
 * @example
 *
 * ```json
 * {"nodes":[{"id":"dd036f7a-c617-4451-aa8e-6cf0dde16d81","type":"studio.tokens.generic.note","inputs":[],"annotations":{"ui.position.x":19.784708658854186,"ui.position.y":110.40046183268228,"ui.nodeType":"studio.tokens.generic.note","ui.description":"You can use contants to connect to multiple nodes to share common values"}},{"id":"41b7ddf1-6c9c-496d-8f8a-80575f31ef1a","type":"studio.tokens.generic.constant","inputs":[{"name":"value","value":"Incoming Value","type":{"$id":"https://schemas.tokens.studio/any.json","title":"Any"},"dynamicType":{"$id":"https://schemas.tokens.studio/string.json","title":"String","type":"string"},"annotations":{"ui.resetable":true}}],"annotations":{"ui.position.x":13.1180419921875,"ui.position.y":245.067128499349}},{"id":"7c542b0d-a790-41b7-9160-3ce4ce1645d6","type":"studio.tokens.string.lowercase","inputs":[{"name":"value","value":"Incoming Value","type":{"$id":"https://schemas.tokens.studio/string.json","title":"String","type":"string"},"visible":true}],"annotations":{"ui.position.x":420.45137532552076,"ui.position.y":143.06712849934894}},{"id":"0d66beae-73e5-48ce-a502-f4e1963aa4f3","type":"studio.tokens.string.uppercase","inputs":[{"name":"value","value":"Incoming Value","type":{"$id":"https://schemas.tokens.studio/string.json","title":"String","type":"string"},"visible":true}],"annotations":{"ui.position.x":429.784708658854,"ui.position.y":262.40046183268225}},{"id":"e0535da0-259a-4c21-aee7-418109929494","type":"studio.tokens.string.split","inputs":[{"name":"value","value":"Incoming Value","type":{"$id":"https://schemas.tokens.studio/string.json","title":"String","type":"string"},"visible":true},{"name":"separator","value":"","type":{"$id":"https://schemas.tokens.studio/string.json","title":"String","type":"string","default":","},"visible":true}],"annotations":{"ui.position.x":433.7847086588543,"ui.position.y":372.4004618326823}}],"edges":[{"id":"9d517cde-beb6-475f-ad18-7adb176c7737","source":"41b7ddf1-6c9c-496d-8f8a-80575f31ef1a","sourceHandle":"value","target":"7c542b0d-a790-41b7-9160-3ce4ce1645d6","targetHandle":"value"},{"id":"10d379e4-1ad4-45d3-bd11-b9e97d06004c","source":"41b7ddf1-6c9c-496d-8f8a-80575f31ef1a","sourceHandle":"value","target":"0d66beae-73e5-48ce-a502-f4e1963aa4f3","targetHandle":"value"},{"id":"7436c6e8-96ad-4217-8eae-76f542166c32","source":"41b7ddf1-6c9c-496d-8f8a-80575f31ef1a","sourceHandle":"value","target":"e0535da0-259a-4c21-aee7-418109929494","targetHandle":"value"}],"annotations":{"engine.id":"aa86a676-c31b-4583-ab7c-bfcb5f0b12fd","engine.capabilities.web-audio":"0.0.0","engine.capabilities.fs":"0.0.0","engine.version":"0.12.0","ui.viewport":{"x":108.63084849784411,"y":187.33543980170202,"zoom":1.1023008602108806},"ui.version":"2.9.4"}}
 * ```
 */
export default class NodeDefinition<T> extends Node {
  static title = "Constant";
  static type = "studio.tokens.generic.constant";

  declare inputs: ToInput<{
    /**
     * The value to output
     */
    value: T;
  }>;
  declare outputs: ToOutput<{
    value: T;
  }>;

  static description =
    "Constant node allows you to provide a constant value. You can use this node to set a constant value for a specific property.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
      visible: false,
    });
    this.addOutput("value", {
      type: AnySchema,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("value");
    this.setOutput("value", input.value, input.type);
  }
}
