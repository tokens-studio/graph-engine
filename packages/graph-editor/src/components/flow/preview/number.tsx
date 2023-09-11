import { Text } from '@tokens-studio/ui';
import React from 'react';

export const choosePreview = (value) => {
  if (value == undefined) {
    return <i>Missing</i>;
  }

  if (isNaN(value)) {
    return <i>NaN</i>;
  }

  if (value == Infinity) {
    return <i>Infinity</i>;
  }

  if (value == -Infinity) {
    return <i>-Infinity</i>;
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
