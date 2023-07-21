import { Text } from '@tokens-studio/ui';

export const PreviewBoolean = ({ value }) => {
  // @ts-ignore
  return <Text title={value}>{value ? 'True' : 'False'}</Text>;
};
