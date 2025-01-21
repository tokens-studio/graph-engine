import { IField } from './interface.js';
import { IconButton, Textarea as UITextarea } from '@tokens-studio/ui';
import { Input } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';

import FloppyDisk from '@tokens-studio/icons/FloppyDisk.js';
import React, { useEffect } from 'react';

export const TextArea = observer(({ settings, port, readOnly }: IField) => {
  const [val, setVal] = React.useState(port.value);

  useEffect(() => {
    setVal(port.value);
  }, [port.value]);

  const onChange = (str: string) => {
    setVal(str);
    if (settings.delayedUpdate) {
      return;
    }

    (port as Input).setValue(str);
  };

  if (readOnly) {
    return <UITextarea value={port.value} disabled />;
  }

  return (
    <>
      <UITextarea value={val} onChange={onChange} />
      {settings.delayedUpdate && (
        <IconButton
          icon={<FloppyDisk />}
          onClick={() => (port as Input).setValue(val)}
        />
      )}
    </>
  );
});
