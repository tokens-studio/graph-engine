import { AllSchemas, Input } from '@tokens-studio/graph-engine';
import { Button, Select, Stack } from '@tokens-studio/ui';
import { IField } from './interface.js';
import { JSONTree } from 'react-json-tree';
import { observer } from 'mobx-react-lite';
import { resetable } from '@/annotations/index.js';
import React from 'react';

export const AnyField = observer(({ port, readOnly }: IField) => {
  const [inputType, setInputType] = React.useState(port.type.$id!);

  const onClick = () => {
    const schema = AllSchemas.find((x) => x.$id === inputType);
    if (!schema) {
      return;
    }
    (port as Input).setValue(schema.default, {
      type: schema,
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
      <Stack direction="row" justify="end">
        <Button emphasis="high" onClick={onClick}>
          Set type
        </Button>
      </Stack>
    </Stack>
  );
});
