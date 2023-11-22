import { Text } from '@tokens-studio/ui';
import React from 'react';
export const PreviewBoolean = ({ value }) => {
  // @ts-ignore
  return <Text title={value}>{value ? 'TRUE' : 'FALSE'}</Text>;
};
