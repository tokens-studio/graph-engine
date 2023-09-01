/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';

import { Box, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { LabelNoWrap } from '../../../../components/label.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/resolve.js';

const SET_ID = 'as Set';

const getTypographyValue = (data) => {
  return data.value;
};
const getNodeValue = (data) => {
  switch (data.type) {
    case 'typography':
      return getTypographyValue(data);
    case 'composition':
      return 'Composition';
    case 'border':
      return 'Border';
    case 'boxShadow':
      return 'Shadow';
    default:
      return data.value;
  }
};

export const ResolveAliasesNode = () => {
  const { input, output } = useNode();

  const [nextInputId, setNextInputId] = useState(0);
  const [nextContextId, setNextContextId] = useState(0);

  const newInputHandle = useMemo(() => {
    setNextInputId(nextInputId + 1);
    return nextInputId + 1;
    //We don't care about the values, just the length
  }, [input.inputs.length]);

  const newContextHandle = useMemo(() => {
    setNextContextId(nextContextId + 1);
    return nextContextId + 1;
    //We don't care about the values, just the length
  }, [input.context.length]);

  // const handles = useMemo(() => {
  //   const { 'as Set': asSet, ...rest } = output || {};

  //   return Object.entries(rest)
  //     .sort(([a], [b]) => a.localeCompare(b))
  //     .map(([key, token]) => (
  //       <Handle id={key} key={key}>
  //         <LabelNoWrap>{key}</LabelNoWrap>
  //         <Box>{getNodeValue(token)}</Box>
  //       </Handle>
  //     ));
  // }, [output]);

  return (
    <Stack direction="row" gap={2}>
      <HandleContainer type="target">
        <Handle id={`inputs.${newInputHandle}`}>
          <Text>
            <i>Input</i>{' '}
          </Text>
        </Handle>
        {input.inputs.map((input, i) => {
          return (
            <Handle id={input.key} key={input.key}>
              <Text css={{ paddingLeft: '$4' }}>{i + 1}</Text>
            </Handle>
          );
        })}
        <Handle id={`context.${newContextHandle}`}>
          <Text>
            <i>Context</i>{' '}
          </Text>
        </Handle>
        {input.context.map((input, i) => {
          return (
            <Handle id={input.key} key={input.key}>
              <Text css={{ paddingLeft: '$4' }}>{i + 1}</Text>
            </Handle>
          );
        })}
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id={SET_ID}>
          <Text>
            <i>As Setxx</i>{' '}
          </Text>
        </Handle>
        {/* {handles} */}
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ResolveAliasesNode, {
  ...node,
  title: 'Resolve Aliases',
});
