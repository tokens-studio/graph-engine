import React from 'react';
import { DynamicValueText } from '../handles';
import { Tooltip } from '@tokens-studio/ui';

export const PreviewArray = ({ value }) => {
  if (!value) {
    return <DynamicValueText>Missing</DynamicValueText>;
  }
  // @ts-ignore
  return (
    <Tooltip label={JSON.stringify(value)}>
      <DynamicValueText title={value}>[{value.length}]</DynamicValueText>
    </Tooltip>
  );
};
