import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.SET;

type Input = Record<string, any>;

type State = {
  title: string;
  urn: string;
};

type Ephemeral = Record<string, any>;

export const defaults: State = {
  title: "",
  urn: "",
};

export const EXTERNAL_SET_ID = "as Set";
export const EXTERNAL_OBJECT_ID = "as Object";

const external = (_, state) => {
  return state;
};

export const process = (input: Input, state: State, ephemeral: Ephemeral) => {
  return ephemeral.tokens;
};

export const mapOutput = (input: Input, state, tokens: SingleToken[]) => {
  if (!tokens) return {};

  const map = tokens.reduce(
    (acc, item) => {
      //Some protection against undefined which can happen if the user deletes a token
      if (!item) {
        return acc;
      }
      acc.values[item.name] = item.value;
      acc.raw[item.name] = item;
      return acc;
    },
    {
      raw: {},
      values: {},
    }
  );

  return {
    [EXTERNAL_SET_ID]: tokens,
    [EXTERNAL_OBJECT_ID]: map.raw,
    ...map.values,
  };
};

export const node: NodeDefinition<Input, State, SingleToken[]> = {
  description: "Retrieves and exposes a remote set of tokens",
  type,
  process,
  defaults,
  mapOutput,
  external,
};
