import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text, TextInput } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/string/regex.js';
import React, { useCallback } from 'react';

interface RegexProps {
  input: string;
  match: string;
  replace: string;
  flags: string;
}

const RegexNode = () => {
  const { input, state, output, setState } = useNode<RegexProps, RegexProps>();

  const onInputChange = useCallback((e) => {
    setState((state) => ({ ...state, input: e.target.value }));
  }, []);

  const onMatchChange = useCallback((e) => {
    setState((state) => ({ ...state, match: e.target.value }));
  }, []);

  const onReplaceChange = useCallback((e) => {
    setState((state) => ({ ...state, replace: e.target.value }));
  }, []);

  const onFlagChange = useCallback((e) => {
    setState((state) => ({ ...state, flags: e.target.value }));
  }, []);
  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Input</Text>
            {input.input !== undefined ? (
              <Text>{input.input}</Text>
            ) : (
              <TextInput
                value={state.input}
                onChange={onInputChange}
                placeholder="String to regex"
              />
            )}
          </Stack>
        </Handle>
        <Handle id="match">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Match</Text>
            {input.match !== undefined ? (
              <Text>{input.match}</Text>
            ) : (
              <TextInput
                value={state.match}
                onChange={onMatchChange}
                placeholder="Regex expression"
              />
            )}
          </Stack>
        </Handle>
        <Handle id="replace">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Replace</Text>
            {input.replace !== undefined ? (
              <Text>{input.replace}</Text>
            ) : (
              <TextInput
                value={state.replace}
                onChange={onReplaceChange}
                placeholder="Replace"
              />
            )}
          </Stack>
        </Handle>
        <Handle id="flags">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Flags</Text>
            {input.flags !== undefined ? (
              <Text>{input.flags}</Text>
            ) : (
              <TextInput
                value={state.flags}
                onChange={onFlagChange}
                placeholder="Regex flags"
              />
            )}
          </Stack>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Text>Output</Text>
            <Text>{output?.output}</Text>
          </Stack>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(RegexNode, {
  ...node,
  title: 'Regex',
});
