export type MappedInput = {
  inputs: {
    key: string;
    value: any;
  }[];
};

/**
 * Pure function
 * @param input
 * @param state
 */
export const mapInput = (input, state): MappedInput => {
  const values = Object.entries(input).sort(([a], [b]) => {
    return ~~a < ~~b ? -1 : 1;
  });

  //Returns the expected array of inputs
  return {
    inputs: values.map(([key, value]) => ({ key, value })),
  } as MappedInput;
};
