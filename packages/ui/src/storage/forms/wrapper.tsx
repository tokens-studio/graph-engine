import { ChangeEventHandler } from '#/types/changeEventHandler.ts';
import { StorageProviderType } from '#/types/storageType.ts';
import { StorageTypeFormValues } from '../types/form.ts';
import GitForm from './github.tsx';

type Props = {
  values: StorageTypeFormValues<true>;
  onChange: ChangeEventHandler;
  onCancel: () => void;
  onSubmit: (values: StorageTypeFormValues<false>) => void;
  isNew?: boolean;
  hasErrored?: boolean;
  errorMessage?: string;
};

export default function StorageItemForm({
  isNew = false,
  onChange,
  onSubmit,
  onCancel,
  values,
  hasErrored,
  errorMessage,
}: Props) {
  switch (values.provider) {
    case StorageProviderType.GITHUB: {
      return (
        <GitForm
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
          values={values}
          hasErrored={hasErrored}
          errorMessage={errorMessage}
        />
      );
    }
    default: {
      return null;
    }
  }
}
