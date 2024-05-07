import { Box, Text } from '@tokens-studio/ui';
import React from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';


export const MathExpression = ({ value }) => {

  return (
    <>
    {value && (
         <MathJaxContext>
            <Text css={{fontFamily: '$mono', fontSize: 'x-large', padding: '$5'}}>
                <MathJax>$${value}$$</MathJax>
            </Text>
        </MathJaxContext>
    )}
    </>
  );
};

export default MathExpression;
