import React from 'react';
import { DynamicValueText } from '../handles';
export const PreviewBoolean = ({ value }) => {
  // @ts-ignore
  return <DynamicValueText title={value}>{value ? 'True' : 'False'}</DynamicValueText>;
};
