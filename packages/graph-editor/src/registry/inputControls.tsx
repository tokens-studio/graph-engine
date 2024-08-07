import { Button, Heading, Select, Stack } from '@tokens-studio/ui';
import { DataflowNode } from '@tokens-studio/graph-engine';
import { StringSchema } from '@tokens-studio/graph-engine';
import { deletable } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

// prettier-ignore
import properties from 'mdn-data/css/properties.json' with { type: 'json' };

const CSSProperties = Object.keys(properties);

const CSSMapSpecifics = observer(({ node }: { node: DataflowNode }) => {
  const [inputName, setInputName] = React.useState('-');

  const onClick = () => {
    node.dataflow.addInput(inputName, {
      type: StringSchema,
      visible: true,
    });
    const input = node.inputs[inputName];
    input.setAnnotation(deletable, true);
    setInputName('');
    node.dataflow?.run();
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

export const inputControls: Record<string, React.FC<{ node: DataflowNode }>> = {
  'studio.tokens.css.map': CSSMapSpecifics,
};
