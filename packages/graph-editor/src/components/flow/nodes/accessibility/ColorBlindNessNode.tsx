import {
  Button,
  Checkbox,
  DropdownMenu,
  Label,
  Stack,
  Text,
} from '@tokens-studio/ui';
import {
  ColorBlindnessTypes,
  node,
} from '@tokens-studio/graph-engine/nodes/accessibility/colorBlindness.js';
import { Handle, HandleContainer } from '../../../../components/flow/handles.tsx';
import { PreviewColor } from '../../preview/color.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { sentenceCase } from 'sentence-case';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback } from 'react';

const keys = Object.values(ColorBlindnessTypes);

const ColorBlindnessNode = (props) => {
  const { input, output, state, setState } = useNode();

  const setType = useCallback((ev) => {
    const type = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      type,
    }));
  }, []);
  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="color">
          <Text>Input color</Text>
          <Text>
            <PreviewColor value={input.color} />
          </Text>
        </Handle>

        <Stack direction="row" justify="between" align="center" gap={3}>
          <Label>Affliction</Label>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {sentenceCase(state.type)}
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                {keys.map((key, i) => {
                  if (!key) {
                    return <DropdownMenu.Separator key={i} />;
                  }

                  return (
                    <DropdownMenu.Item
                      key={key}
                      onClick={setType}
                      data-key={key}
                    >
                      {sentenceCase(key)}
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
          <Text>Output</Text>
          <PreviewColor value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ColorBlindnessNode, {
  ...node,
  title: 'Color Blindness',
});
