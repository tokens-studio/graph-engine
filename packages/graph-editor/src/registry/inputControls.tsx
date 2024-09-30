import { Button } from '@tokens-studio/ui/Button.js';
import { Heading } from '@tokens-studio/ui/Heading.js';
import { Node } from '@tokens-studio/graph-engine';
import { Scroll } from '@tokens-studio/ui/Scroll.js';
import { Select } from '@tokens-studio/ui/Select.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { StringSchema } from '@tokens-studio/graph-engine';
import { deletable } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

// prettier-ignore
import properties from 'mdn-data/css/properties.json' with { type: 'json' };

const CSSProperties = Object.keys(properties);

const CSSMapSpecifics = observer(({ node }: { node: Node }) => {
  const [inputName, setInputName] = React.useState('-');

  const onClick = () => {
    const input = node.addInput(inputName, {
      type: StringSchema,
      visible: true,
    });
    input.annotations[deletable] = true;
    setInputName('');
    node.run();
  };

  const isDisabled = useMemo(() => {
    return inputName === '-' || Boolean(node.inputs[inputName]);
  }, [inputName, node.inputs]);

  return (
    <Stack direction="column" gap={4}>
      <Heading size="small">Expose Property</Heading>
      <Select value={inputName} onValueChange={setInputName}>
        <Select.Trigger label="Type" value={inputName} />
        <Select.Content css={{ maxHeight: '300px' }} position="popper">
          <Scroll height="200">
            {CSSProperties.map((x) => (
              <Select.Item value={x} key={x}>
                {x}
              </Select.Item>
            ))}
          </Scroll>
        </Select.Content>
      </Select>

      <Stack justify="end">
        <Button variant="primary" disabled={isDisabled} onClick={onClick}>
          Add Input
        </Button>
      </Stack>
    </Stack>
  );
});

export const inputControls = {
  'studio.tokens.css.map': CSSMapSpecifics,
} as Record<string, React.FC<{ node: Node }>>;
