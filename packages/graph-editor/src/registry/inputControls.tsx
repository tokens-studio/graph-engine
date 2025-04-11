import { Button, Heading, Select, Stack } from '@tokens-studio/ui';
import { Node } from '@tokens-studio/graph-engine';
import { StringSchema } from '@tokens-studio/graph-engine';
import { deletable } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

// prettier-ignore
import * as mdnData from 'mdn-data';
// @ts-ignore
const properties = mdnData.css.properties;

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
        <Select.Content>
          <div style={{ height: '200px' }}>
            {CSSProperties.map((x) => (
              <Select.Item value={x} key={x}>
                {x}
              </Select.Item>
            ))}
          </div>
        </Select.Content>
      </Select>

      <Stack justify="end">
        <Button emphasis="high" disabled={isDisabled} onClick={onClick}>
          Add Input
        </Button>
      </Stack>
    </Stack>
  );
});

export const inputControls = {
  'studio.tokens.css.map': CSSMapSpecifics,
} as Record<string, React.FC<{ node: Node }>>;
