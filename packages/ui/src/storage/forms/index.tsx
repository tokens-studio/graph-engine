import { StorageProviderType } from '#/types/storageType.ts';
import React from 'react';
import { StorageTypeFormValues } from '../types/form.ts';
import { Eventlike } from '#/types/changeEventHandler.ts';
import StorageItemForm from './wrapper.tsx';
import { Dialog } from '@tokens-studio/ui';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  storageProvider: StorageProviderType;
};

export default function CreateStorageItemModal({
  isOpen,
  onClose,
  onSuccess,
  storageProvider,
}: Props) {
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const [formFields, setFormFields] = React.useState<
    StorageTypeFormValues<true>
  >(
    React.useMemo(
      () => ({
        provider: storageProvider,
      }),
      [storageProvider],
    ),
  );

  const handleCreateNewClick = React.useCallback(
    async (values: StorageTypeFormValues<false>) => {
      // setHasErrored(false);
      // const response = await addNewProviderItem(values);
      // if (response.status === 'success') {
      //     onSuccess();
      // } else {
      //     setHasErrored(true);
      //     setErrorMessage(response?.errorMessage);
      // }
    },
    [],
  );

  const handleChange = React.useCallback(
    (e: Eventlike) => {
      setFormFields({ ...formFields, [e.target.name]: e.target.value });
    },
    [formFields],
  );

  const handleSubmit = React.useCallback(
    (values: StorageTypeFormValues<false>) => {
      handleCreateNewClick(values);
    },
    [handleCreateNewClick],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Add new credentials</Dialog.Title>
          <StorageItemForm
            isNew
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            values={formFields}
            hasErrored={hasErrored}
            errorMessage={errorMessage}
          />
          <Dialog.CloseButton />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
