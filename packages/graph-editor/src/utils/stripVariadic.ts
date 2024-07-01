/**
 * Variadic named handles have the name of the handle followed by [index] where index is a number
 * @param name
 * @returns
 */
export const stripVariadic = (name: string) => name.split('[')[0];

export const getVariadicIndex = (name: string) => {
  const index = name.match(/\[(\d+)\]/);
  if (index) {
    return parseInt(index[1]);
  }
  return -1;
};
