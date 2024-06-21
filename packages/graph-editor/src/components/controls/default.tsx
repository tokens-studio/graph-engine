import { IField } from './interface';
import { JSONTree } from 'react-json-tree';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import React from 'react';

export const DefaultField = observer(({ port }: IField) => {
  let value = toJS(port.value);
  if (Array.isArray(value)) {
    value = { items: value };
  }

  return <JSONTree data={value} shouldExpandNodeInitially={() => true} />;
});
