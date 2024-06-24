import { CurveEditor } from '../curveEditor/index.js';
import { IField } from './interface.js';
import { Input } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const CurveField = observer(({ port, readOnly }: IField) => {
  const onChange = (index: number, value: number[]) => {
    if (!readOnly) {
      const points = [...port.value.curves[0].points];
      points[index] = value;
      (port as Input).setValue({
        curves: [
          {
            points,
          },
        ],
      });
    }
  };
  return (
    <CurveEditor points={port.value.curves[0].points} onChange={onChange} />
  );
});
