'use client';
import {
	Box,
	Button,
	Heading,
	Label,
	Separator,
	Stack,
	TextInput
} from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import { useParams, useRouter } from 'next/navigation.js';
import MDEditor from '@uiw/react-md-editor';
//Add rehype to prevent any client of injecting malicious code
import { Upload } from 'iconoir-react';
import { useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';

const Page = () => {
	const params = useParams();
	const { id } = params;

	const { mutateAsync, isPending } =
		client.marketplace.publishGraph.useMutation({
			onSuccess: () => {
				//Return the user to their dashboard
				router.push('/dashboard/');
			}
		});

	const { data } = client.graph.getGraph.useQuery(['getGraph', id], {
		params: {
			id: id as string
		}
	});

	const [name, setName] = useState(data.body.name);
	const [thumbnail, setThumbnail] = useState<File | null>(null);

	const [description, setDescription] = useState(data.body.description || '');
	const router = useRouter();
	const { isPending: isSummarizing, mutateAsync: getAISummary } =
		client.ai.getAISummary.useMutation();
	const onSummarize = async () => {
		if (!data?.body.graph) {
			const response = await getAISummary({
				body: {
					graph: data?.body.graph
				}
			});

			setDescription(response.body.summary);
		}
	};

	const onPublish = () => {
		if (isPending) return;

		if (!thumbnail) {
			return;
		}

		mutateAsync({
			params: {
				id
			},
			body: {
				thumbnail,
				name,
				description
			}
		});
	};
	return (
		<Stack direction='column' width='full' gap={3}>
			<Heading size='large'>Publish</Heading>
			<Separator orientation='horizontal' />
			<Box css={{ padding: '$2' }}>
				<form>
					<Stack direction='column' gap={3}>
						<Stack direction='column' gap={2}>
							<Label>Name</Label>
							<TextInput
								onChange={e => setName(e.target.value)}
								value={name}
							></TextInput>
						</Stack>

						<Label>Thumbnail</Label>
						<input
							multiple={false}
							type='file'
							onChange={e => setThumbnail(e.target.files?.[0] || null)}
						/>

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
						<br />
						<Box>
							<Button
								onClick={onPublish}
								loading={isPending}
								variant='primary'
								icon={<Upload />}
							>
								Update
							</Button>
						</Box>
					</Stack>
				</form>
			</Box>
		</Stack>
	);
};

export default Page;
