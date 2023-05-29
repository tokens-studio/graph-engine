export type MappedInput = {
  inputs: {
    key: string;
    value: number;
  }[];
};

/**
 * Optional validation function.
 * @param inputs
 */
export const validateInputs = (inputs) => {
  inputs.inputs.forEach((x) => {
    const val = parseFloat(x.value);
    if (isNaN(val)) {
      throw new Error("Invalid input, expected a number");
    }
  });
};

/**
 * Pure function
 * @param input
 * @param state
 */
export const mapInput = (input): MappedInput => {
  const values = Object.entries(input).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  //Returns the expected array of inputs
  return {
    inputs: values.map(([key, value]) => ({
      key,
      value: parseFloat(value as string),
    })),
  } as MappedInput;
};
