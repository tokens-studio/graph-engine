import { FloppyDisk } from 'iconoir-react';
import { IField } from './interface.js';
import { IconButton, Textarea as UITextarea } from '@tokens-studio/ui';
import { Input } from '@tokens-studio/graph-engine';
import { delayedUpdateSelector } from '@/redux/selectors/index.js';
import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

export const TextArea = observer(({ port, readOnly }: IField) => {
  const useDelayed = useSelector(delayedUpdateSelector);
  const [val, setVal] = React.useState(port.value);

  useEffect(() => {
    setVal(port.value);
  }, [port.value]);

  const onChange = (str: string) => {
    setVal(str);
    if (useDelayed) {
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
      {useDelayed && (
        <IconButton
          icon={<FloppyDisk />}
          onClick={() => (port as Input).setValue(val)}
        />
      )}
    </>
  );
});
