'use client';
import {
	Avatar,
	Box,
	Button,
	Heading,
	IconButton,
	Spinner,
	Stack,
	Tabs,
	Text
} from '@tokens-studio/ui';
import { Download, Heart } from 'iconoir-react';
import { ImageHolder, PreviewImage } from '../../clientPage.tsx';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { useParams, useRouter } from 'next/navigation.js';
import MDEditor from '@uiw/react-md-editor';

const Page = () => {
	const router = useRouter();
	const params = useParams() || {};
	const id = params.id as string;

	const { isPending, mutateAsync } = client.marketplace.likeGraph.useMutation();

	const { isLoading, data, error } = client.marketplace.getGraph.useQuery(
		['market', 'getGraph', id],
		{
			params: {
				id
			}
		}
	);

	const { mutateAsync: copyGraph, isPending: isCopying } =
		client.marketplace.copyGraph.useMutation();

	useErrorToast(error);

	const onUseGraph = async () => {
		const res = await copyGraph({
			params: {
				id
			},
			body: undefined
		});
		const graphId = res.body.id;
		router.push(`/editor/${graphId}`);
	};

	const onLike = () => {
		if (isPending) {
			return;
		}

		mutateAsync({
			params: {
				id
			},
			body: undefined
		});
	};

	return (
		<Stack direction='column' width='full' gap={3}>
			{isLoading && <Spinner />}
			{!isLoading && data && (
				<>
					<Stack
						direction='row'
						gap={4}
						align='center'
						justify='between'
						width='full'
						css={{ padding: '$6' }}
					>
						<Box css={{ padding: '$6' }}>
							<Stack direction='column' gap={3} css={{ padding: '$6' }}>
								<Stack gap={2} align='center'>
									<Avatar src={data.body.user.image} />
									<Text>{data.body.user.name}</Text>
								</Stack>

								<Heading size='large'>{data.body.name}</Heading>
								<Stack gap={2}>
									<Text size='xsmall' muted>
										<Heart /> {data.body.likes}
									</Text>
									<Text size='xsmall' muted>
										<Download /> {data.body.downloads}
									</Text>
								</Stack>
								<Stack gap={3} align='center'>
									<Button
										loading={isCopying}
										size='large'
										variant='primary'
										onClick={onUseGraph}
									>
										Use graph
									</Button>
									<IconButton
										onClick={onLike}
										loading={isPending}
										size='large'
										icon={<Heart />}
									/>
								</Stack>
							</Stack>
						</Box>
						<Box css={{ width: '40%' }}>
							<ImageHolder>
								<PreviewImage
									src={data?.body.thumbnail || '/thumbnail.png'}
									alt='Graph preview iamge'
								/>
							</ImageHolder>
						</Box>
					</Stack>
					<Tabs defaultValue='about'>
						<Tabs.List>
							<Tabs.Trigger value='about'>About</Tabs.Trigger>
							<Tabs.Trigger value='comments'>Comments</Tabs.Trigger>
							<Tabs.Trigger value='versions'>Versions</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value='about'>
							<Box css={{ padding: '$3' }}>
								<Stack direction='column' gap={2}>
									<MDEditor.Markdown
										source={data.body.description.replace(/\\n/g, '\n')}
									/>
								</Stack>
							</Box>
						</Tabs.Content>
					</Tabs>
				</>
			)}
		</Stack>
	);
};

export default Page;
