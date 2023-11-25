import { Button, DropdownMenu, Label, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/array/passUnit.js';
import { useCallback, useMemo } from 'react';
import React from 'react';

const ArrayPassUnit = (props) => {
  const { input, output, state, setState } = useNode();
  const setUnit = useCallback((ev) => {
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      unit: key,
    }));
  }, []);

  const outputHandles = useMemo(() => {
    const { asArray, ...rest } = output || {};

    return Object.entries(rest).map(([key, value]) => {
      return (
        <Handle id={key} key={key}>
          <Stack direction="row" justify="between" gap={5} align="center">
            <Label>{key}</Label>
            <PreviewAny value={value} />
          </Stack>
        </Handle>
      );
    });
  }, [output]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="value">
          <Label>Array</Label>
          <PreviewAny value={input.array} />
        </Handle>
        <Handle id="unit">
          <Label>Unit</Label>

          {input.unit !== undefined ? (
            <Text>{input.unit}</Text>
          ) : (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" asDropdown size="small">
                  {state.unit}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onClick={setUnit} data-key="px">
                    px
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="em">
                    em
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="rem">
                    rem
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="%">
                    %
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="pt">
                    pt
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="pc">
                    pc
                  </DropdownMenu.Item>

                  <DropdownMenu.Item onClick={setUnit} data-key="vw">
                    vw
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="vh">
                    vh
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="mm">
                    mm
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="cm">
                    cm
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={setUnit} data-key="in">
                    in
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          )}
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id={'asArray'}>as Array</Handle>
        {outputHandles}
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ArrayPassUnit, {
  ...node,
  title: 'Array Pass Unit',
});
