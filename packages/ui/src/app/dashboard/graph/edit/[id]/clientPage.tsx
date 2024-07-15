'use client';

import {
	Box,
	Button,
	Heading,
	Label,
	Spinner,
	Stack,
	TextInput
} from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import MDEditor from '@uiw/react-md-editor';
import React, { useCallback, useEffect } from 'react';
//Add rehype to prevent any client of injecting malicious code
import { useRouter } from 'next/navigation.js';
import { useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';

const Page = ({ id }) => {
	const { isLoading, data, error } = client.graph.getGraph.useQuery(
		['getGraph', id],
		{
			params: {
				id
			}
		}
	);
	const router = useRouter();
	const [name, setName] = useState(data?.body.name);
	const [description, setDescription] = useState(data?.body.description || '');
	const { mutateAsync, isPending } = client.graph.updateGraph.useMutation({
		onSuccess: () => {
			router.push('/dashboard');
		}
	});

	useEffect(() => {
		if (data) {
			setName(data.body.name!);
			setDescription(data.body.description! || '');
		}
	}, [data]);

	const onUpdate = useCallback(() => {
		if (isPending) {
			return;
		}
		mutateAsync({
			params: {
				id
			},
			body: {
				name,
				description
			}
		});
	}, [description, id, isPending, mutateAsync, name]);

	useErrorToast(error);

	return (
		<Stack
			css={{
				position: 'relative',
				width: '100%',
				height: '100%',
				overflow: 'auto',
				background: '$gray1',
				paddingTop: '$6'
			}}
			justify='center'
		>
			<Box css={{ padding: '$5', width: '80%' }}>
				<Heading size='large'>Edit Graph details</Heading>
				{isLoading && <Spinner />}
				{!isLoading && (
					<>
						<Stack gap={2} direction='column'>
							<Label>Graph ID</Label>
							<TextInput value={id} disabled></TextInput>
							<Label>Name</Label>
							<TextInput value={name}></TextInput>
							<Label>Description</Label>
							<MDEditor
								value={description}
								onChange={setDescription}
								previewOptions={{
									rehypePlugins: [[rehypeSanitize]]
								}}
							/>
						</Stack>
						<br />
						<Button onClick={onUpdate} loading={isPending} variant='primary'>
							Save
						</Button>
					</>
				)}
			</Box>
		</Stack>
	);
};

export default Page;
