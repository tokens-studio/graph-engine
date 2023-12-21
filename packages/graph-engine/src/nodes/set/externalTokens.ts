// import { NodeDefinition, NodeTypes } from "../../types.js";
// import { setProperty } from "dot-prop";

// export const static type = NodeTypes.SET;

// type Input = Record<string, any>;

// type State = {
//   title: string;
//   urn: string;
// };

// type Ephemeral = Record<string, any>;

// export const defaults: State = {
//   title: "",
//   urn: "",
// };

// export const EXTERNAL_SET_ID = "as Set";
// export const EXTERNAL_OBJECT_ID = "as Object";

// const external = (_, state) => {
//   return state;
// };

// export const process = (input: Input, state: State, ephemeral: Ephemeral) => {
//   let tokens = ephemeral.tokens || [];
//   if (!tokens) return {};

//   const map = tokens.reduce(
//     (acc, item) => {
//       //Some protection against undefined which can happen if the user deletes a token
//       if (!item) {
//         return acc;
//       }
//       const { name, ...rest } = item;
//       acc.values[name] = item.value;
//       setProperty(acc.raw, name, rest);
//       return acc;
//     },
//     {
//       raw: {},
//       values: {},
//     }
//   );

//   return {
//     [EXTERNAL_SET_ID]: tokens,
//     [EXTERNAL_OBJECT_ID]: map.raw,
//     ...map.values,
//   };
// };

// export const mapOutput = (input: Input, state, output) => output;

// export const node: NodeDefinition<Input, State> = {
//   description: "Retrieves and exposes a remote set of tokens",
//   type,
//   process,
//   defaults,
//   mapOutput,
//   external,
// };
