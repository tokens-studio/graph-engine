import { Text } from '@tokens-studio/ui';

export const PreviewArray = ({ value }) => {
  if (!value) {
    return <i>Missing</i>;
  }
  // @ts-ignore
  return <Text title={value}>[...] {value.length}</Text>;
};
