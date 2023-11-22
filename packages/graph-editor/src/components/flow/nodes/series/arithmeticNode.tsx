import { Handle, HandleContainer } from '../../handles.tsx';
import { Label, Stack, Text, TextInput } from '@tokens-studio/ui';
import { LabelNoWrap } from '../../../../components/label.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/series/arithmetic.js';
import { sortEntriesNumerically } from '@tokens-studio/graph-engine/nodes/utils.js';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';

const ArithmeticNode = (props) => {
  const { output, input, state, setState } = useNode();

  const onChange = useCallback(
    (e: any) => {
      const key = e.target.dataset.key;
      const value = e.target.value;
      setState((state) => ({
        ...state,
        [key]: value,
      }));
    },
    [setState],
  );

  const outputHandles = useMemo(() => {
    const { asArray, ...rest } = output || {};
    return sortEntriesNumerically(Object.entries(rest)).map(([key, value]) => {
      return (
        <Handle id={key} key={key}>
          <Stack direction="row" justify="between" gap={5} align="center">
            <Label>{key}</Label>
            <PreviewNumber value={value} />
          </Stack>
        </Handle>
      );
    });
  }, [output]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="base">
          <Stack direction="row" justify="between" gap={3} align="center">
            <Label>Base</Label>
            {input?.base ? (
              <PreviewNumber value={input.base} />
            ) : (
              <TextInput
                data-key="base"
                value={state.base}
                onChange={onChange}
              />
            )}
          </Stack>
        </Handle>

        <Handle id="stepsDown">
          <LabelNoWrap>Steps Down</LabelNoWrap>
          {input?.stepsDown ? (
            <PreviewNumber value={input.stepsDown} />
          ) : (
            <TextInput
              data-key="stepsDown"
              value={state.stepsDown}
              onChange={onChange}
            />
          )}
        </Handle>

        <Handle id="steps">
          <LabelNoWrap>Steps Up</LabelNoWrap>
          {input?.steps ? (
            <PreviewNumber value={input.steps} />
          ) : (
            <TextInput
              data-key="steps"
              value={state.steps}
              onChange={onChange}
            />
          )}
        </Handle>

        <Handle id="increment">
          <Stack direction="row" justify="between" gap={3} align="center">
            <Label>Increment</Label>
            {input?.increment ? (
              <PreviewNumber value={input.increment} />
            ) : (
              <TextInput
                data-key="increment"
                value={state.increment}
                onChange={onChange}
              />
            )}
          </Stack>
        </Handle>


        <Handle id="precision">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Precision</Text>
            {input.precision !== undefined ? (
              <Text>{input.precision}</Text>
            ) : (
              <TextInput
                data-key="precision"
                value={state.precision}
                onChange={onChange} />
            )}
          </Stack>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id={'asArray'}>as Array</Handle>
        {outputHandles}
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ArithmeticNode, {
  ...node,
  title: 'Arithmetic series',
});
