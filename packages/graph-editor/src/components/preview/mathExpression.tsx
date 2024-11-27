import { Text } from '@tokens-studio/ui';
import React from 'react';

export const MathExpression = ({ value }) => {
  return (
    <>
      {value && (
        <Text
          style={{
            font: 'var(--typography-body-xl)',
            padding: 'var(--component-spacing-xl)',
          }}
        >
          {value}
        </Text>
      )}
    </>
  );
};

export default MathExpression;
