import {
  Box,
  Button,
  DropdownMenu,
  Label,
  Stack,
  TextInput,
} from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import {
  colorSpaces,
  node,
} from '@tokens-studio/graph-engine/nodes/color/create.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback } from 'react';

const CreateColorNode = () => {
  const { input, state, setState, output } = useNode();
  const setColorSpace = useCallback((ev) => {
    const space = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      space,
    }));
  }, []);

  const setValue = useCallback((ev) => {
    const value = ev.target.value;
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={4}>
        <HandleContainer type="target">
          <Handle id="a">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>A</Label>
              {input.a !== undefined ? (
                <PreviewNumber value={input.a} />
              ) : (
                <TextInput onChange={setValue} value={state.a} data-key="a" />
              )}
            </Stack>
          </Handle>
          <Handle id="b">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>B</Label>
              {input.b !== undefined ? (
                <PreviewNumber value={input.b} />
              ) : (
                <TextInput onChange={setValue} value={state.b} data-key="b" />
              )}
            </Stack>
          </Handle>

          <Handle id="c">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>C</Label>
              {input.c !== undefined ? (
                <PreviewNumber value={input.c} />
              ) : (
                <TextInput onChange={setValue} value={state.c} data-key="c" />
              )}
            </Stack>
          </Handle>
          <Handle id="d">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>Alpha</Label>

              {input.d !== undefined ? (
                <PreviewNumber value={input.d} />
              ) : (
                <TextInput onChange={setValue} value={state.d} data-key="d" />
              )}
            </Stack>
          </Handle>
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Label>Space</Label>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" asDropdown size="small">
                  {state.space}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  {colorSpaces.map((key, i) => {
                    if (!key) {
                      return <DropdownMenu.Separator key={i} />;
                    }

                    return (
                      <DropdownMenu.Item
                        key={key}
                        onClick={setColorSpace}
                        data-key={key}
                      >
                        {key}
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          </Stack>
        </HandleContainer>
        <HandleContainer type="source">
          <Handle id="output">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>Output</Label>
              <PreviewColor value={output?.output} />
            </Stack>
          </Handle>
        </HandleContainer>
      </Stack>
      <Box
        css={{
          height: '8em',
          border: '0.5px solid $borderMuted',
          borderRadius: '$small',
          background: output?.output,
        }}
      ></Box>
    </Stack>
  );
};

export default WrapNode(CreateColorNode, {
  ...node,
  title: 'Create Color',
});
