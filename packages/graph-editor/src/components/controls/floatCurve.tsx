import { FloatCurveEditor } from '../floatCurveEditor/index.js';
import { IField } from './interface.js';
import { Input } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const FloatCurveField = observer(({ port, readOnly }: IField) => {
  const onChange = (curve) => {
    if (!readOnly) {
      (port as Input).setValue(curve);
    }
  };
  return <FloatCurveEditor curve={port.value} onChange={onChange} />;
});
