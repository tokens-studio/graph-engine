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
import { useRouter } from 'next/navigation.js';
import MDEditor from '@uiw/react-md-editor';
//Add rehype to prevent any client of injecting malicious code
import { Upload } from 'iconoir-react';
import { useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';

const Page = ({ id }) => {
	const { mutateAsync, isPending } =
		client.marketplace.publishGraph.useMutation({
			onSuccess: () => {
				//Return the user to their dashboard
				router.push('/dashboard/');
			}
		});

	const [name, setName] = useState('');
	const [thumbnail, setThumbnail] = useState<File | null>(null);

	const [description, setDescription] = useState('');
	const router = useRouter();

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
