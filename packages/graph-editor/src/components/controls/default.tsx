import { observer } from 'mobx-react-lite';
import { JSONTree } from 'react-json-tree';
import React from 'react';
import { IField } from './interface';
import { toJS } from 'mobx';

export const DefaultField = observer(({ port }: IField) => {
  let value = toJS(port.value);
  if (Array.isArray(value)) {
    value = { items: value };
  }

  return <JSONTree data={value} />;
});
