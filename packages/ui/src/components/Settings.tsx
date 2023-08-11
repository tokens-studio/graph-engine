import {
  Button,
  Dialog,
  Stack,
  Label,
  DropdownMenu,
  Text,
} from '@tokens-studio/ui';

export const Settings = () => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button>Settings</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>

          <Stack direction="column" gap={2} justify="between">
            <Label>Sync Providers</Label>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button size="small">Add New</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content side="bottom">
                {/* {
                                storagePro.map((provider) => (
                                    <DropdownMenu.Item key={provider.type} onSelect={handleProviderClick(provider.type)} css={{ display: 'flex', gap: '$3' }} data-testid={`add-${provider.text}-credential`}>
                                        <Box css={{ color: '$contextMenuForeground' }}>{getProviderIcon(provider.type)}</Box>
                                        {provider.text}
                                    </DropdownMenu.Item>
                                ))
                            } */}
              </DropdownMenu.Content>
            </DropdownMenu>
          </Stack>

          <Dialog.CloseButton />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
