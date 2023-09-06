import { PreviewBoolean } from './boolean.tsx';
import { Text } from '@tokens-studio/ui';
import PreviewNumber from './number.tsx';
import React from 'react';
import { DynamicValueText } from '../handles.tsx';

export const PreviewAny = ({ value }) => {
  if (value == undefined) {
    return (
      <Text>
        <i>Missing</i>
      </Text>
    );
  }

  switch (typeof value) {
    case 'boolean':
      return <PreviewBoolean value={value} />;
    case 'number':
      return <PreviewNumber value={value} />;
    case 'object':
      if (Array.isArray(value)) {
        return <DynamicValueText>Array</DynamicValueText>;
      }
      return <DynamicValueText>Object</DynamicValueText>;
    default:
      return (
        <DynamicValueText
          css={{ fontFamily: 'monospace', fontSize: '$xsmall' }}
        >
          {value}
        </DynamicValueText>
      );
  }
};
