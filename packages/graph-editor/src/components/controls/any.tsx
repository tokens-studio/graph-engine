import { observer } from 'mobx-react-lite';
import { IField } from './interface';
import { AllSchemas, Input, STRING } from '@tokens-studio/graph-engine';
import {
  Button,
  Select,
  Stack,
} from '@tokens-studio/ui';
import React from 'react';
import { JSONTree } from 'react-json-tree';
import { resetable } from '@/annotations';

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
    return <JSONTree shouldExpandNodeInitially={()=>true} data={port.value} />;
  }

  return (
    <Stack direction="column" gap={3}>
      <Select value={inputType} onValueChange={setInputType}>
        <Select.Trigger label="Type" value={inputType} />
        {/* @ts-expect-error */}
        <Select.Content css={{ maxHeight: '200px' }} position="popper">
          {AllSchemas.map((x, i) => (
            <Select.Item value={x.$id!} key={i}>
              {x.title || x.$id}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Stack direction="row" justify="end">
        <Button variant="primary" onClick={onClick}>
          Set type
        </Button>
      </Stack>
    </Stack>
  );
});
