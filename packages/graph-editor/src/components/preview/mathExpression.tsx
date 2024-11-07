import { Text } from '@tokens-studio/ui';
import React from 'react';

export const MathExpression = ({ value }) => {
  return (
    <>
      {value && (
        <Text css={{ fontFamily: '$mono', fontSize: 'x-large', padding: '$5' }}>
          {value}
        </Text>
      )}
    </>
  );
};

export default MathExpression;
