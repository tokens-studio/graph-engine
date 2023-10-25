import React, { useMemo, useCallback } from 'react';
import { Handle, HandleContainer } from '../../handles.tsx';
import { Stack, Text, Label, Checkbox, Button, DropdownMenu } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node, WcagVersion } from '@tokens-studio/graph-engine/nodes/color/nearest.js';
import { PreviewAny } from '../../preview/any.tsx';

const NearestTokensNode = () => {
  const { input, state, output, setState } = useNode();
    const randomID = useMemo(() => 'x' + Math.random(), []);

    const setWcag = useCallback(
      (ev) => {
        const version =
          WcagVersion[ev.currentTarget.dataset.key as keyof typeof WcagVersion];
        setState((state) => ({
          ...state,
          wcag: version,
        }));
      },
      [setState],
    );

  const onChange = (checked) => {
    setState((state) => ({
      ...state,
      inverted: checked,
    }));
  };

  const handleCompareChange = (compare) => {
    setState((state) => ({ ...state, compare }));
  };

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="sourceColor">
          <Text>Source Color</Text>
          <PreviewAny value={input.sourceColor} />  
        </Handle>
        <Handle id="tokens">
          <Text>Token Set</Text>
          <PreviewAny value={input.tokens} /> 
        </Handle>
        <Handle id="compare">
          <Text>Compare</Text>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {state.compare}
              </Button>
            </DropdownMenu.Trigger> 

            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => handleCompareChange('Contrast')} data-key="Contrast">
                  Contrast
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleCompareChange('Hue')} data-key="Hue">
                  Hue
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleCompareChange('Lightness')} data-key="Lightness">
                  Lightness
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleCompareChange('Saturation')} data-key="Saturation">
                  Saturation
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </Handle>
        <Stack direction="row" justify="between">
          <Label>Inverted</Label>
          <Checkbox
            id={randomID}
            checked={state.inverted}
            onCheckedChange={onChange}
          />
        </Stack>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="sortedTokens">
          <Text>Sorted Tokens</Text>
          <PreviewAny value={output?.sortedTokens} /> 
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
                    <DropdownMenu.Item
                      key={key}
                      onClick={setWcag}
                      data-key={key}
                    >
                      {value}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          )}
        </Handle>
        </HandleContainer>
    </Stack>
  );
};

export default WrapNode(NearestTokensNode, {
  ...node,
  title: 'Nearest Tokens',
});
