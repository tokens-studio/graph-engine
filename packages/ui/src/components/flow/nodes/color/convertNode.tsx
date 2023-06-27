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
} from '@tokens-studio/graph-engine/nodes/color/convert.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback } from 'react';

const outputLabels = ['a', 'b', 'c', 'd'];

const ConvertColorNode = () => {
  const { input, state, setState, output } = useNode();
  const setColorSpace = useCallback((ev) => {
    const space = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      space,
    }));
  }, []);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={4}>
        <HandleContainer type="target">
          <Handle id="color">
            <Stack direction="row" justify="between" align="center" gap={3}>
              <Label>Color</Label>
              <PreviewColor value={input.color} />
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
          {output &&
            output.channels.map((col, i) => {
              return (
                <Handle id={outputLabels[i]}>
                  <Label>{output.labels[i]}</Label>
                  <PreviewNumber value={col} />
                </Handle>
              );
            })}
        </HandleContainer>
      </Stack>
    </Stack>
  );
};

export default WrapNode(ConvertColorNode, {
  ...node,
  title: 'Convert Color',
});
