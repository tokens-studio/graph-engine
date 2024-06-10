import React from 'react';
import { TextInput } from '@tokens-studio/ui';
import withVariadicField from './withVariadicField';
import { Edge, Port } from '@tokens-studio/graph-engine';

const VariadicNumberUI = ({ port, edge }: { port: Port, edge: Edge }) => {
  return (
    <TextInput value={port.value[edge.annotations['engine.index']]} disabled />
  )
};

export const VariadicNumber = withVariadicField(VariadicNumberUI);