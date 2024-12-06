'use client';
import {
	Avatar,
	Button,
	Heading,
	IconButton,
	Spinner,
	Stack,
	Tabs,
	Text
} from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { useParams, useRouter } from 'next/navigation.js';
import Download from '@tokens-studio/icons/Download.js';
import Heart from '@tokens-studio/icons/Heart.js';
import MDEditor from '@uiw/react-md-editor';
import styles from './clientPage.module.css';

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
			}
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
						className={styles.headerStack}
					>
						<div className={styles.contentBox}>
							<Stack direction='column' gap={3}>
								<Stack gap={2} align='center'>
									<Avatar src={data.body.user.image!} />
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
										emphasis='high'
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
						</div>
						<div className={styles.imageContainer}>
							<div className={styles.imageHolder}>
								<img
									className={styles.previewImage}
									src={data?.body.thumbnail || '/thumbnail.png'}
									alt='Graph preview image'
								/>
							</div>
						</div>
					</Stack>
					<Tabs defaultValue='about'>
						<Tabs.List>
							<Tabs.Trigger value='about'>About</Tabs.Trigger>
							<Tabs.Trigger value='comments'>Comments</Tabs.Trigger>
							<Tabs.Trigger value='versions'>Versions</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value='about'>
							<div className={styles.aboutContent}>
								<Stack direction='column' gap={2}>
									{/* @ts-ignore Move to tiptap */}
									<MDEditor.Markdown
										source={data.body.description?.replace(/\\n/g, '\n')}
									/>
								</Stack>
							</div>
						</Tabs.Content>
					</Tabs>
				</>
			)}
		</Stack>
	);
};

export default Page;
