'use client';
import {
	Box,
	Button,
	Heading,
	Label,
	Separator,
	Spinner,
	Stack,
	TextInput
} from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import { useEffect, useState } from 'react';
import Link from 'next/link.js';

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
		<Stack direction='column' width='full' gap={3}>
			<Heading size='large'>Public profile</Heading>
			<Separator />
			<Box css={{ padding: '$2' }}>
				{isLoading && <Spinner></Spinner>}
				{!isLoading && (
					<>
						<Stack direction='column' gap={3}>
							<Stack direction='column' gap={2}>
								<Label>Username</Label>
								<TextInput onChange={onNameChange} value={name}></TextInput>
							</Stack>
						</Stack>
						<br />
						<Button onClick={onUpdate} loading={isPending} variant='primary'>
							Update
						</Button>
					</>
				)}
			</Box>

			<Heading size='large'>Actions</Heading>
			<Separator />
			<Link href='/api/auth/signout'>
				<Button variant='secondary'>Sign out</Button>
			</Link>
		</Stack>
	);
};

export default Page;
