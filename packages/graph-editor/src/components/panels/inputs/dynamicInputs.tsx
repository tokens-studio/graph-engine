import {
  Button,
  Checkbox,
  Label,
  Select,
  Stack,
  TextInput,
} from '@tokens-studio/ui';
import { Node } from '@tokens-studio/graph-engine';
import { STRING } from '@tokens-studio/graph-engine';
import { SchemaSelector } from '@/redux/selectors/index.js';
import { deletable } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';

export const DynamicInputs = observer(({ node }: { node: Node }) => {
  const [inputName, setInputName] = React.useState('');
  const [inputType, setInputType] = React.useState('-');
  const [asArray, setAsArray] = React.useState(false);
  const [enumerated, setEnumerated] = React.useState(false);
  const [enumeratedValues, setEnumeratedValues] = React.useState<string>('');

  const schemas = useSelector(SchemaSelector);

  const newInput = () => {
    //Find the schema
    const schema = schemas.find((x) => x.$id === inputType);
    let type = {
      ...schema,
    };
    const innerType = type;

    if (asArray) {
      type = {
        type: 'array',
        items: type,
        default: [],
      };
    }

    if (enumerated) {
      innerType.enum = enumeratedValues.split(',').map((x) => x.trim());
      if (!asArray) {
        innerType.default = type.enum[0];
      }
    }

    const input = node.addInput(inputName, {
      type,
      visible: node.nodeType() !== 'studio.tokens.generic.input',
    });
    input.annotations[deletable] = true;
    //We trigger running the node to either propagate the new input or to update the node
    node.run();
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  const isDisabled = useMemo(() => {
    return (
      inputName === '' || inputType === '-' || Boolean(node.inputs[inputName])
    );
  }, [inputName, inputType, node.inputs]);

  const onClick = () => {
    newInput();
    //Reset the values
    setInputName('');
    setInputType('-');
    setEnumeratedValues('');
    setEnumerated(false);
  };

  return (
    <Stack direction="column" gap={4}>
      <Stack direction="row" gap={3}>
        <TextInput
          onChange={onNameChange}
          placeholder={'Input name'}
          value={inputName}
        />
      </Stack>
      {/* @ts-ignore */}
      <Select value={inputType} onValueChange={setInputType}>
        <Select.Trigger label="Type" value={inputType} />
        <Select.Content>
          <div style={{ height: '200px' }}>
            {schemas.map((x, i) => (
              <Select.Item value={x.$id!} key={i}>
                {x.title || x.$id}
              </Select.Item>
            ))}
          </div>
        </Select.Content>
      </Select>

      <Stack gap={3} align="center">
        <Label>Is an array?</Label>
        <Checkbox
          onCheckedChange={(v) => setAsArray(Boolean(v))}
          checked={asArray}
        />
      </Stack>

      {inputType === STRING && (
        <Stack gap={3} align="center">
          <Label>Is enumerated?</Label>
          <Checkbox
            onCheckedChange={(v) => setEnumerated(Boolean(v))}
            checked={enumerated}
          />
        </Stack>
      )}

      {enumerated && (
        <Stack gap={3}>
          <Label>Enumerated Values</Label>
          <TextInput
            value={enumeratedValues}
            onChange={(e) => setEnumeratedValues(e.target.value)}
            placeholder={'Comma separated values'}
          />
        </Stack>
      )}

      <Stack justify="end">
        <Button emphasis="high" disabled={isDisabled} onClick={onClick}>
          Add Input
        </Button>
      </Stack>
    </Stack>
  );
});
