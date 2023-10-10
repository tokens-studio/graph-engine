import {
  Button,
  IconButton,
  Label,
  Stack,
  Text,
  Textarea,
} from '@tokens-studio/ui';
import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import {
  node,
  ValidationError,
} from '@tokens-studio/graph-engine/nodes/input/json.js';
import { PreviewAny } from '../../preview/any.tsx';
import { useCallback } from 'react';
import React from 'react';

const JsonNode = (props) => {
  const { input, error, output, state, setState } = useNode();

  const onChangeInput = useCallback(
    (value) => {
      setState({ ...state, input: value });
    },
    [setState, state],
  );

  const onChangeSchema = useCallback(
    (value) => {
      setState({ ...state, schema: value });
    },
    [setState, state],
  );

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Stack direction="column" gap={2} width="full">
            <HandleText>Input</HandleText>
            <Textarea
              rows={7}
              value={input.input || state.input}
              disabled={input.input}
              onChange={onChangeInput}
            />
          </Stack>
        </Handle>
        <Handle id="schema">
          <Stack direction="column" gap={2} width="full">
            <HandleText>Schema</HandleText>
            <Textarea
              rows={7}
              value={input.schema || state.schema}
              disabled={input.schema}
              onChange={onChangeSchema}
            />
          </Stack>
        </Handle>
        {error && (
          <>
            <Text>{error.message}</Text>
            {(error as ValidationError).errors.map((err) => (
              <Text>{err.message}</Text>
            ))}
          </>
        )}
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
          <PreviewAny value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(JsonNode, {
  ...node,
  title: 'Json Node',
});
