import { Text } from '@tokens-studio/ui';
import React from 'react';
import { DynamicValueText } from '../handles';

export const PreviewArray = ({ value }) => {
  if (!value) {
    return <DynamicValueText>Missing</DynamicValueText>;
  }
  // @ts-ignore
  return <DynamicValueText title={value}>{value.length}</DynamicValueText>;
};
