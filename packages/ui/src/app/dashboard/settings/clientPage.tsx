'use client';
import { Button, Label, Spinner, Stack, TextInput } from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import { useEffect, useState } from 'react';

const Page = () => {
	const { data, isLoading } = client.auth.getWhoAmI.useQuery(['getWhoAmI']);

	const { mutateAsync, isPending } = client.auth.updateUser.useMutation();

	const [name, setName] = useState('');

	useEffect(() => {
		if (data?.body) {
			setName(data?.body.user.name);
		}
	}, [data]);

	const onUpdate = async () => {
		await mutateAsync({
			body: {
				name
			}
		});
	};

	const onNameChange = e => {
		setName(e.target.value);
	};

	return (
		<Stack direction='row' width='full'>
			{isLoading && <Spinner></Spinner>}
			{!isLoading && (
				<Stack direction='column' gap={3}>
					<Stack direction='column' gap={2}>
						<Label>Username</Label>
						<TextInput onChange={onNameChange} value={name}></TextInput>
					</Stack>

					<Button onClick={onUpdate} loading={isPending} variant='primary'>
						Update
					</Button>
				</Stack>
			)}
		</Stack>
	);
};

export default Page;
