import React from 'react';
import { DynamicValueText } from '../handles';

export const choosePreview = (value) => {
  if (value == undefined) {
    return <DynamicValueText error>Missing</DynamicValueText>;
  }

  if (isNaN(value)) {
    return <DynamicValueText>NaN</DynamicValueText>;
  }

  if (value == Infinity) {
    return <DynamicValueText>Infinity</DynamicValueText>;
  }

  if (value == -Infinity) {
    return <DynamicValueText>-Infinity</DynamicValueText>;
  }
  return <span>{Math.round(value * 100) / 100}</span>;
};

export const PreviewNumber = ({ value }) => {
  if (value == undefined) {
    return <></>;
  }

  // @ts-ignore
  return <DynamicValueText title={value}>{choosePreview(value)}</DynamicValueText>;
};

export default PreviewNumber;
