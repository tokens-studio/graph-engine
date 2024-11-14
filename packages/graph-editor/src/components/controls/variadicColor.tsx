import { Edge, Port, toColor, toHex } from '@tokens-studio/graph-engine';
import { Stack, Text } from '@tokens-studio/ui';
import React from 'react';
import styles from './variadicColor.module.css';
import withVariadicField from './withVariadicField.js';

const VariadicColorUI = ({ port, edge }: { port: Port; edge: Edge }) => {
  const value = port.value[edge.annotations['engine.index']];
  const hex = toHex(toColor(value));

  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <button
        className={styles.colorButton}
        style={{ backgroundColor: hex }}
        type="button"
      />
      <Text>{hex}</Text>
    </Stack>
  );
};

export const VariadicColor = withVariadicField(VariadicColorUI);
