import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.ARRAY_PASS_UNIT;

const defaults = {
  unit: "px",
};

type Value = {
    index: number;
    value: string;
}

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
const process = (input, state) => {
    //Override with state if defined
    const final = {
        ...state,
        ...input,
    };

    const values: Value[] = [];

    final.value.map((item) => {

        console.log(item);
        
        values.push({
            index: item.index,
            value: `${item.value}${final.unit || ""}`
            });
    });    

    return values;
};


export const mapOutput = (input, state, processed: Value[]) => {
    const mapped = { asArray: processed };
  
    processed.forEach((item) => {
      mapped[`${item.index}`] = item.value;
    });
    return mapped;
  };


export const node: NodeDefinition = {
  description: "Adds a unit to a value for an array",
  type,
  defaults,
  mapOutput,
  process
};
