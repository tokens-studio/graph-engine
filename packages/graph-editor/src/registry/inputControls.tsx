import {
  AllSchemas,
  AnySchema,
  NumberSchema,
  NodeTypes,
  STRING,
  StringSchema,
} from '@tokens-studio/graph-engine';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Label,
  Scroll,
  Select,
  Stack,
  TextInput,
} from '@tokens-studio/ui';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { Node } from '@tokens-studio/graph-engine';

import properties from 'mdn-data/css/properties.json';
import { deletable } from '@/annotations';

const CSSProperties = Object.keys(properties);


const SwitchNodeSpecifics = observer(({ node }: { node: Node }) => {
  const [inputName, setInputName] = React.useState('');

  const onClick = () => {
    const input = node.addInput(inputName, {
      type: AnySchema,
    });
    input.annotations[deletable] = true;
    setInputName('');
    node.run();
  };

  return (
    <Stack direction="column" gap={4}>
      <Heading size="small">Expose option</Heading>
      <Stack direction="row" gap={3}>
        <TextInput
          onChange={(e) => setInputName(e.target.value)}
          placeholder={'Option name'}
          value={inputName}
        />
      </Stack>

      <Stack justify="end">
        <Button variant="primary" disabled={!inputName} onClick={onClick}>
          Add Option
        </Button>
      </Stack>
    </Stack>
  );
});

const CSSMapSpecifics = observer(({ node }: { node: Node }) => {
  const [inputName, setInputName] = React.useState('-');

  const onClick = () => {
    const input = node.addInput(inputName, {
      type: StringSchema,
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
        {/* @ts-expect-error */}
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
  [NodeTypes.SWITCH]: SwitchNodeSpecifics,
  [NodeTypes.CSS_MAP]: CSSMapSpecifics,
} as Record<string, React.FC<{ node: Node }>>;
