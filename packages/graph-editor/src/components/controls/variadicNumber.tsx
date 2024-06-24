import { Edge, Port } from '@tokens-studio/graph-engine';
import { TextInput } from '@tokens-studio/ui';
import React from 'react';
import withVariadicField from './withVariadicField.js';

const VariadicNumberUI = ({ port, edge }: { port: Port; edge: Edge }) => {
  return (
    <TextInput value={port.value[edge.annotations['engine.index']]} disabled />
  );
};

export const VariadicNumber = withVariadicField(VariadicNumberUI);
