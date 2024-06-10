import React from 'react';
import { Text, TextInput } from '@tokens-studio/ui';
import withVariadicField from './withVariadicField';
import { Edge, Port } from '@tokens-studio/graph-engine';

const VariadicAnyUI = ({ port, edge }: { port: Port, edge: Edge }) => {
  const value = port.value[edge.annotations['engine.index']];

  console.log({ type: typeof value });

  switch (typeof value) {
    case 'string':
      return (
        <TextInput value={value} disabled />
      );
    case 'number':
      return (
        <TextInput value={value.toString()} disabled />
      );
    case 'boolean':
      return (
        <TextInput value={value.toString()} disabled />
      );

    default:
      return (
        <Text>
          {`${port.name}-${edge.annotations['engine.index']}`}
        </Text>
      )
  }
};

export const VariadicAny = withVariadicField(VariadicAnyUI);