import React, { useRef } from 'react';
import zod from 'zod';
import { v4 } from 'uuid';
import { ChangeEventHandler } from '#/types/changeEventHandler.ts';
import {
  Box,
  Button,
  Heading,
  Label,
  Stack,
  Text,
  TextInput,
} from '@tokens-studio/ui';
import { StorageProviderType } from '#/types/storageType.ts';
import { ErrorMessage } from '#/components/ErrorMessage.tsx';
import { StorageTypeFormValues } from '../types/form.ts';

type ValidatedFormValues = Extract<
  StorageTypeFormValues<false>,
  { provider: StorageProviderType.GITHUB }
>;
type Props = {
  values: Extract<
    StorageTypeFormValues<true>,
    { provider: StorageProviderType.GITHUB }
  >;
  onChange: ChangeEventHandler;
  onSubmit: (values: ValidatedFormValues) => void;
  onCancel: () => void;
  hasErrored?: boolean;
  errorMessage?: string;
};

export default function GitForm({
  onChange,
  onSubmit,
  onCancel,
  values,
  hasErrored,
  errorMessage,
}: Props) {
  const inputEl = useRef<HTMLInputElement | null>(null);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const zodSchema = zod.object({
        provider: zod.string(),
        name: zod.string(),
        id: zod.string(),
        branch: zod.string(),
        filePath: zod.string(),
        baseUrl: zod.string().optional(),
        secret: zod.string(),
        internalId: zod.string().optional(),
      });
      const validationResult = zodSchema.safeParse(values);
      if (validationResult.success) {
        const formFields = {
          ...validationResult.data,
          internalId: validationResult.data.internalId || v4(),
        } as ValidatedFormValues;
        onSubmit(formFields);
      }
    },
    [values, onSubmit],
  );

  const baseUrlPlaceholder = `https://${values.provider}.acme-inc.com${
    values.provider === StorageProviderType.GITHUB ? '/api/v3' : ''
  }`;

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" gap={4}>
        <Stack direction="column" gap={1}>
          <Heading>Add new Github credentials</Heading>
          <Text muted>
            Access graphs stored on your repository, push and pull tokens in a
            two-way sync.
          </Text>
        </Stack>
        <Label htmlFor="name">Name</Label>
        <TextInput
          value={values.name || ''}
          onChange={onChange}
          type="text"
          name="name"
          required
        />
        <Box css={{ position: 'relative' }}>
          <Label htmlFor="secret">Personal access token</Label>
          <TextInput
            value={values.secret || ''}
            onChange={onChange}
            ref={inputEl}
            type="password"
            name="secret"
            required
          />
        </Box>
        <Label htmlFor="id">Repository</Label>
        <TextInput
          value={values.id || ''}
          onChange={onChange}
          type="text"
          name="id"
          required
        />
        <Label htmlFor="branch">Branch</Label>
        <TextInput
          value={values.branch || ''}
          onChange={onChange}
          type="text"
          name="branch"
          required
        />
        <Label htmlFor="filePath">File path</Label>
        <TextInput
          defaultValue=""
          value={values.filePath || ''}
          onChange={onChange}
          type="text"
          name="filePath"
        />
        <Label htmlFor="baseUrl">Base Url</Label>
        <TextInput
          value={values.baseUrl || ''}
          placeholder={baseUrlPlaceholder}
          onChange={onChange}
          type="text"
          name="baseUrl"
        />
        <Stack direction="row" gap={4}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={!values.secret && !values.name}
          >
            Save
          </Button>
        </Stack>
        {hasErrored && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Stack>
    </form>
  );
}
