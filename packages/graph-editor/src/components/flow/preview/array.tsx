import React from 'react';
import { DynamicValueText } from '../handles';
import { Tooltip } from '@tokens-studio/ui';

export const PreviewArray = ({ value }) => {
  if (!value) {
    return <DynamicValueText>Missing</DynamicValueText>;
  }

  return (
    <Tooltip label={JSON.stringify(value)}>
      <DynamicValueText>[{value.length}]</DynamicValueText>
    </Tooltip>
  );
};
