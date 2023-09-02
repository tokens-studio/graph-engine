import { Text } from '@tokens-studio/ui';
import React from 'react';

export const PreviewArray = ({ value }) => {
  if (!value) {
    return <Text>Missing</Text>;
  }
  // @ts-ignore
  return <Text title={value}>[...] {value.length}</Text>;
};
