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
import { useParams, useRouter } from 'next/navigation.js';
import { useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';

const Page = () => {
	const params = useParams();
	const { id } = params;

	const { isLoading, data, error } = client.graph.getGraph.useQuery(
		['getGraph', id],
		{
			params: {
				id: id as string
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
	const { isPending: isSummarizing, mutateAsync: getAISummary } =
		client.ai.getAISummary.useMutation();
	const onSummarize = async () => {
		const response = await getAISummary({
			body: {
				graph: data?.body.graph
			}
		});

		setDescription(response.body.summary);
	};

	const onNameChange = e => {
		setName(e.target.value);
	};

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
							<TextInput onChange={onNameChange} value={name}></TextInput>
							<Label>Description</Label>
							<MDEditor
								value={description}
								onChange={setDescription}
								previewOptions={{
									rehypePlugins: [[rehypeSanitize]]
								}}
							/>
							<Box>
								<Button loading={isSummarizing} onClick={onSummarize}>
									Summarize with AI
								</Button>
							</Box>
						</Stack>
						<br />
						<Button onClick={onUpdate} loading={isPending} emphasis='high'>
							Save
						</Button>
					</>
				)}
			</Box>
		</Stack>
	);
};

export default Page;
