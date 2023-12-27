// import { NodeDefinition, NodeTypes } from "../../types.js";
// import { SingleToken } from "@tokens-studio/types";

// export const static type = NodeTypes.EXTRACT_SINGLE_TOKEN;

// /**
//  * Defines the starting state of the node
//  */
// export const defaults = {
//   name: "",
//   tokens: [],
//   enableRegex: false,
// };

// export type MappedInput = {
//   tokens: SingleToken[];
//   name: string;
//   enableRegex: boolean;
// };

// export const process = (input, state) => {
//   const final = {
//     ...state,
//     ...input,
//   };

//   const regex = new RegExp(`${final.name}`);
//   const index = final.tokens.findIndex((token) =>
//     final.enableRegex ? token.name.match(regex) : token.name === final.name
//   );
//   const token = final.tokens[index];
//   return {
//     found: !!token,
//     token,
//     index,
//   };
// };

// const mapOutput = (input, state, output) => output;

// export const node: NodeDefinition<MappedInput, any> = {
//   description: "Extracts a single token and returns its values",
//   type,
//   defaults,
//   process,
//   mapOutput,
// };
