import { observer } from 'mobx-react-lite';
import { IField } from './interface';
import { CurveEditor } from '../curveEditor';
import React from 'react';
import { Input } from '@tokens-studio/graph-engine';

export const CurveField = observer(({ port, readOnly }: IField) => {
  const [forceRender, setForceRender] = React.useState(0);
  const onChange = (index: number, value: number[]) => {
    if (!readOnly) {
      port.value.curves[0].points[index] = value;
      (port as Input).setValue(port.value);
    }
    setForceRender(forceRender + 1);
  };

  return (
    <CurveEditor points={port.value.curves[0].points} onChange={onChange} />
  );
});
