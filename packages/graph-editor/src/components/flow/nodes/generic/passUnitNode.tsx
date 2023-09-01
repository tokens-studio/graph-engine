import { Button, DropdownMenu, Label, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/typing/passUnit.js';
import { useCallback } from 'react';
import React from 'react';

const PassUnit = (props) => {
  const { input, output, state, setState } = useNode();
  const setFallback = useCallback((ev) => {
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      fallback: key,
    }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="value">
          <Label>Value</Label>
          <Text>{input.value}</Text>
        </Handle>
        <Handle id="fallback">
          <Label>Fallback</Label>

          {input.fallback !== undefined ? (
            <Text>{input.fallback}</Text>
          ) : (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" asDropdown size="small">
                  {state.fallback}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onClick={setFallback} data-key="px">
                    px
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="em">
                    em
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="rem">
                    rem
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="%">
                    %
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="pt">
                    pt
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="pc">
                    pc
                  </DropdownMenu.Item>

                  <DropdownMenu.Item onClick={setFallback} data-key="vw">
                    vw
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="vh">
                    vh
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="mm">
                    mm
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="cm">
                    cm
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setFallback} data-key="in">
                    in
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          )}
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="output">
          <Label>Output</Label>
          <Text>{output?.output}</Text>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(PassUnit, {
  ...node,
  title: 'Pass Unit',
});
