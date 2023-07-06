import { Button, DropdownMenu, Label, Stack, Text, TextInput } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '#/components/flow/handles.tsx';
import { PreviewColor } from '../../preview/color.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node, WcagVersion } from '@tokens-studio/graph-engine/nodes/color/contrasting.js';
import PreviewNumber from '../../preview/number.tsx';
import React, {useCallback} from 'react';
import {PreviewBoolean} from "../../preview/boolean.tsx";
import {PreviewAny} from "../../preview/any.tsx";

const ContrastingNode = () => {
  const { input, output, state, setState } = useNode();
  const setWcag = useCallback((ev) => {
    const version = WcagVersion[ev.currentTarget.dataset.key as keyof typeof WcagVersion];
    setState((state) => ({
      ...state,
      wcag: version,
    }));
  }, [setState]);

  const setThreshold = useCallback((ev) => {
    const threshold = ev.target.value;
    setState((state) => ({
      ...state,
      threshold,
    }));
  }, [setState]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="a">
          <Text>Color A</Text>
          <Text>
            <PreviewColor value={input.a} />
          </Text>
        </Handle>
        <Handle id="b">
          <Text>Color B</Text>
          <Text>
            <PreviewColor value={input.b} />
          </Text>
        </Handle>
        <Handle id="background">
          <Text>Background</Text>
          <Text>
            <PreviewColor value={input.background} />
          </Text>
        </Handle>
        <Handle id="wcag">
          <Label>WCAG Version</Label>

          {input.wcag !== undefined ? (
            <Text>{input.wcag}</Text>
          ) : (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" asDropdown size="small">
                  {state.wcag}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  {Object.entries(WcagVersion).map(([key, value]) => (
                    <DropdownMenu.Item key={key} onClick={setWcag} data-key={key}>
                      {value}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          )}
        </Handle>
        <Handle id="threshold">
          <Stack direction="row" justify="between" gap={3} align="center">
            <Label>Threshold</Label>
            {input.threshold !== undefined ? (
              <PreviewNumber value={input.threshold} />
            ) : (
              <TextInput onChange={setThreshold} value={state.threshold} />
            )}
          </Stack>
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="color">
          <Text>Color</Text>
          <PreviewColor value={output?.color} />
        </Handle>
        <Handle id="contrast">
          <Text>Contrast</Text>
          <PreviewAny value={output?.contrast} />
        </Handle>
        <Handle id="sufficient">
          <Text>Sufficient</Text>
          <PreviewBoolean value={output?.sufficient} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ContrastingNode, {
  ...node,
  title: 'Contrast',
});
