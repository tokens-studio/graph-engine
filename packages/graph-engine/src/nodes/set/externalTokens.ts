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

const external = (_, state) => {
  return state;
};

export const process = (input: Input, state: State, ephemeral: Ephemeral) => {
  return ephemeral.tokens;
};

export const mapOutput = (input: Input, state, tokens: SingleToken[]) => {
  if (!tokens) return {};

  const map = tokens.reduce((acc, item) => {
    //Some protection against undefined which can happen if the user deletes a token
    if (!item) {
      return acc;
    }
    acc[item.name] = item.value;
    return acc;
  }, {});

  return {
    [EXTERNAL_SET_ID]: tokens,
    ...map,
  };
};

export const node: NodeDefinition<Input, State, SingleToken[]> = {
  type,
  process,
  defaults,
  mapOutput,
  external,
};
