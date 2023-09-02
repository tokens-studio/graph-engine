import { Text } from '@tokens-studio/ui';
import React from 'react';

export const choosePreview = (value) => {
  if (value == undefined) {
    return <Text>Missing</Text>
  }

  if (isNaN(value)) {
    return <Text>NaN</Text>
  }

  if (value == Infinity) {
    return <Text>Infinity</Text>
  }

  if (value == -Infinity) {
    return <Text>-Infinity</Text>
  }
  return <span>{Math.round(value * 100) / 100}</span>;
};

export const PreviewNumber = ({ value }) => {
  if (value == undefined) {
    return <></>;
  }

  // @ts-ignore
  return <Text title={value}>{choosePreview(value)}</Text>;
};

export default PreviewNumber;
