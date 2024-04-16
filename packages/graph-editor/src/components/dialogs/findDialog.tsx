import React from 'react';
import { Button, Dialog, TextInput, Text } from '@tokens-studio/ui';

export const FindDialog = ({ children }) => {
  const [id, setId] = React.useState('');

  const onClick = () => {};

  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.SimplePortal>
          <Dialog.Title>Find Node</Dialog.Title>

          <Text>Find by ID</Text>
          <TextInput value={id} onChange={(e) => setId(e.target.value)} />
          <Button onClick={onClick}>Find</Button>

      </Dialog.SimplePortal>
    </Dialog>
  );
};
