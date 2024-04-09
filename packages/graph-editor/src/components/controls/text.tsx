import { observer } from 'mobx-react-lite';
import { IField } from './interface';
import React from 'react';
import { Input } from '@tokens-studio/graph-engine';
import {  Textarea as UITextarea } from '@tokens-studio/ui';

export const TextArea = observer(({ port, readOnly }: IField) => {
  const onChange = (str:string) => {
    (port as Input).setValue(str);
  };

  if (readOnly) {
    return <UITextarea value={port.value} disabled/>;
  }

  return <UITextarea value={port.value} onChange={onChange} />;
});
