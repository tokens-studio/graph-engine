import { AllSchemas, Input } from '@tokens-studio/graph-engine';
import { Button, Checkbox, Label, Select, Stack } from '@tokens-studio/ui';
import { IField } from './interface.js';
import { JSONTree } from 'react-json-tree';
import { observer } from 'mobx-react-lite';
import { resetable } from '@/annotations/index.js';
import React from 'react';

export const AnyField = observer(({ port, readOnly }: IField) => {
  const [inputType, setInputType] = React.useState(port.type.$id!);
  const [asArray, setAsArray] = React.useState(port.type.type === 'array');

  const onClick = () => {
    const schema = AllSchemas.find((x) => x.$id === inputType);
    if (!schema) {
      return;
    }
    let type = { ...schema };
    if (asArray) {
      type = {
        type: 'array',
        items: type,
        default: [],
      };
    }
    (port as Input).setValue(asArray ? [] : schema.default, {
      type,
    });
    port.annotations[resetable] = true;
  };

  if (readOnly) {
    return (
      <JSONTree shouldExpandNodeInitially={() => true} data={port.value} />
    );
  }

  return (
    <Stack direction="column" gap={3}>
      <Select value={inputType} onValueChange={setInputType}>
        <Select.Trigger label="Type" value={inputType} />
        <Select.Content>
          {AllSchemas.map((x, i) => (
            <Select.Item value={x.$id!} key={i}>
              {x.title || x.$id}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <Stack gap={3} align="center">
        <Label>Is an array?</Label>
        <Checkbox
          onCheckedChange={(v) => setAsArray(Boolean(v))}
          checked={asArray}
        />
      </Stack>

      <Stack direction="row" justify="end">
        <Button emphasis="high" onClick={onClick}>
          Set type
        </Button>
      </Stack>
    </Stack>
  );
});
