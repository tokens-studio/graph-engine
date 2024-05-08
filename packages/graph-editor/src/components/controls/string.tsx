
import { observer } from 'mobx-react-lite';
import { IField } from './interface';
import React, { useEffect } from 'react';
import { Input } from '@tokens-studio/graph-engine';
import { IconButton, Text, TextInput, Stack } from '@tokens-studio/ui';
import { delayedUpdateSelector } from '@/redux/selectors';
import { useSelector } from 'react-redux';
import { FloppyDisk } from 'iconoir-react';

export const Textfield = observer(({ port, readOnly }: IField) => {


  const useDelayed = useSelector(delayedUpdateSelector);
  const [val, setVal] = React.useState(port.value);

  useEffect(() => {
    setVal(port.value);
  }, [port.value]);


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const str = e.target.value;
    setVal(str);
    if (useDelayed) {
      return;
    }

    (port as Input).setValue(str);
  };

  if (readOnly) {
    return <Text>{port.value}</Text>;
  }

  return <Stack gap={3}>
    <TextInput width={'100%'} value={val} onChange={onChange} />
    {useDelayed && <IconButton icon={<FloppyDisk />} onClick={() => (port as Input).setValue(val)} />}
  </Stack>;
});
