import {
	Box,
	Button,
	IconButton,
	Label,
	Stack,
	Text,
	TextInput
} from '@tokens-studio/ui';
import React from 'react';

import { EyeClosed, EyeSolid } from 'iconoir-react';
import { GithubStorage } from '@/lib/storage/providers/github.ts';
import { providersSelector } from '@/redux/selectors/storage.ts';
import { useSelector } from 'react-redux';
import Store from '@/redux/index.tsx';

export function RemoteStoragePanel() {
	return (
		<Store>
			<RemoteStorageContainer />
		</Store>
	);
}

export function RemoteStorageContainer() {
	const providers = useSelector(providersSelector);

	return (
		<Stack
			direction='column'
			gap={2}
			css={{ height: '100%', flex: 1, padding: '$3' }}
		>
			{providers.map(provider => {
				return (
					<Box key={provider.name}>
						<Stack
							direction='column'
							gap={1}
							css={{
								padding: '$3',
								border: '1px solid $border',
								borderRadius: '$2'
							}}
						>
							<Text size='small'>{provider.name}</Text>
							<Text size='xsmall'>{provider.storageType}</Text>
						</Stack>
					</Box>
				);
			})}
			<Button variant='primary'>Add Storage</Button>
		</Stack>
	);
}

export type CreateEditGithubStorageProps = {
	storage?: GithubStorage;
};

export function CreateEditGithubStorage({
	storage
}: CreateEditGithubStorageProps) {
	const [masked, setMasked] = React.useState(true);

	const [name, setName] = React.useState(storage?.name ?? '');
	const [password, setPassword] = React.useState(storage?.secret ?? '');
	const [repo, setRepo] = React.useState(storage?.repository ?? '');
	const [branch, setBranch] = React.useState(storage?.branch ?? '');
	const [path, setPath] = React.useState(storage?.path ?? '');
	const [baseUrl, setBaseUrl] = React.useState(storage?.baseUrl ?? '');

	const toggleMasked = () => {
		setMasked(prev => !prev);
	};

	const Icon = masked ? EyeSolid : EyeClosed;

	return (
		<Stack
			direction='column'
			gap={2}
			css={{ height: '100%', flex: 1, padding: '$3' }}
		>
			<Label>Name</Label>
			<TextInput
				value={name}
				onChange={e => setName(e.target.value)}
				type='text'
				name='name'
				required
			/>

			<Label>Personal Access Token</Label>
			<TextInput
				value={password}
				onChange={e => setPassword(e.target.value)}
				type={masked ? 'password' : 'text'}
				name='secret'
				required
				trailingAction={
					<IconButton
						variant='invisible'
						icon={<Icon />}
						onClick={toggleMasked}
					/>
				}
			/>
			<Label>Repository (owner/repo)</Label>
			<TextInput
				value={repo}
				onChange={e => setRepo(e.target.value)}
				type='text'
				name='repo'
				required
			/>
			<Label>Branch</Label>
			<TextInput
				value={branch}
				onChange={e => setBranch(e.target.value)}
				type='text'
				name='branch'
				required
			/>
			<Label>Path</Label>
			<TextInput
				onChange={e => setPath(e.target.value)}
				value={path}
				type='text'
				name='path'
				required
			/>
			<Label>Base URL (Optional)</Label>
			<TextInput
				onChange={e => setBaseUrl(e.target.value)}
				value={baseUrl}
				type='text'
				name='baseUrl'
			/>

			<Stack justify='between'>
				<Button>Cancel </Button>
				<Button variant='primary'>Save</Button>
			</Stack>
		</Stack>
	);
}
