'use client';

import {
	Box,
	Button,
	DropdownMenu,
	Heading,
	IconButton,
	Spinner,
	Stack,
	Text,
	TextInput
} from '@tokens-studio/ui';
import { Graph } from '@tokens-studio/graph-engine';
import { ShareButton } from '@/components/editor/toolbar.tsx';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast, useToast } from '@/hooks/useToast.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation.js';
import Book from '@tokens-studio/icons/Book.js';
import Download from '@tokens-studio/icons/Download.js';
import EditPencil from '@tokens-studio/icons/EditPencil.js';
import GraphUp from '@tokens-studio/icons/GraphUp.js';
import Link from 'next/link.js';
import MoreVert from '@tokens-studio/icons/MoreVert.js';
import Plus from '@tokens-studio/icons/Plus.js';
import React, { useCallback, useEffect, useState } from 'react';
import Search from '@tokens-studio/icons/Search.js';
import Upload from '@tokens-studio/icons/Upload.js';
import Xmark from '@tokens-studio/icons/Xmark.js';
import ago from 's-ago';

const GraphItem = ({ id, name, updatedAt }) => {
	const { mutateAsync: deleteGraph, isPending } =
		client.graph.deleteGraph.useMutation();

	const router = useRouter();

	const [loading, setIsLoading] = useState(false);

	const queryClient = useQueryClient();

	const onDelete = useCallback(async () => {
		await deleteGraph({
			params: {
				id
			},
			body: undefined
		});

		queryClient.invalidateQueries({
			queryKey: ['listGraphs']
		});
	}, [deleteGraph, id, queryClient]);

	useEffect(() => {
		setIsLoading(isPending);
	}, [isPending]);

	const onPublish = useCallback(async () => {
		setIsLoading(true);
		return router.push(`/marketplace/publish/${id}/`);
	}, [id, router]);

	const onDownload = useCallback(async () => {
		setIsLoading(true);
		try {
			const graph = await client.graph.getGraph.query({
				params: {
					id
				}
			});

			const blob = new Blob([JSON.stringify(graph.body.graph)], {
				type: 'application/json'
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${name}.json`;
			a.click();
		} finally {
			setIsLoading(false);
		}
	}, [id, name]);

	return (
		<Stack width='full' direction='row' align='center'>
			<Stack
				css={{
					flex: 1,
					'&:hover': {
						background: '$gray3'
					},
					borderRadius: '$medium',
					borderColor: '$border',
					padding: '$4'
				}}
				direction='row'
				gap={3}
				align='center'
			>
				<Box
					css={{
						color: '$fgDefault',
						padding: '$3',
						borderRadius: '$medium',
						background: '$gray2'
					}}
				>
					<GraphUp />
				</Box>

				<Stack direction='column'>
					<Link href={`/editor/${id}`}>
						<Heading>{name}</Heading>
					</Link>
					<Text size='xsmall' muted>
						Last updated {ago(new Date(updatedAt))}
					</Text>
				</Stack>
			</Stack>
			<Stack gap={2}>
				<Link href={`/dashboard/graph/edit/${id}`}>
					<IconButton icon={<EditPencil />} variant='invisible' />
				</Link>
				<ShareButton id={id} />
				{loading && <IconButton variant='invisible' icon={<Spinner />} />}
				{!loading && (
					<DropdownMenu>
						<DropdownMenu.Trigger asChild>
							<IconButton variant='invisible' icon={<MoreVert />} />
						</DropdownMenu.Trigger>
						<DropdownMenu.Portal>
							<DropdownMenu.Content>
								<DropdownMenu.Item onClick={onDelete}>
									<DropdownMenu.LeadingVisual>
										<Xmark />
									</DropdownMenu.LeadingVisual>
									Delete
								</DropdownMenu.Item>
								<DropdownMenu.Item onClick={onDownload}>
									<DropdownMenu.LeadingVisual>
										<Download />
									</DropdownMenu.LeadingVisual>
									Download
								</DropdownMenu.Item>
								<DropdownMenu.Item onClick={onPublish}>
									<DropdownMenu.LeadingVisual>
										<Book />
									</DropdownMenu.LeadingVisual>
									Publish
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu>
				)}
			</Stack>
		</Stack>
	);
};

const Page = () => {
	const [search, setSearch] = React.useState('');
	const makeToast = useToast();
	const router = useRouter();

	const {
		mutateAsync,
		isPending,
		error: MutateError
	} = client.graph.createGraph.useMutation();

	const createGraph = async () => {
		const serialized = new Graph().serialize();
		const newGraph = await mutateAsync({
			body: {
				name: 'New graph',
				graph: serialized
			}
		});
		router.push(`/editor/${newGraph.body.id}`);
	};

	const importGraph = async () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) {
				return;
			}

			const reader = new FileReader();
			reader.onload = async () => {
				const graph = JSON.parse(reader.result as string);
				try {
					//Attempt to get the name from the annotation
					const name = graph?.annotations['engine.title'] || 'New Graph';

					const newGraph = await mutateAsync({
						body: {
							name,
							graph
						}
					});
					router.push(`/editor/${newGraph.body.id}`);
				} catch (err) {
					console.log(err);
					makeToast({
						title: 'Failed to import graph',
						description: (err as Error).message
					});
				}
			};
			reader.readAsText(file);
		};
		input.click();
	};

	const { isLoading, data, error } = client.graph.listGraphs.useQuery([
		'listGraphs'
	]);

	useErrorToast(MutateError);
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
				<Stack direction='column' gap={4}>
					<Stack justify='between'>
						<Heading size='large'>Graphs</Heading>
						<Stack gap={3}>
							<Button
								loading={isPending}
								onClick={importGraph}
								variant='secondary'
								icon={<Upload />}
							>
								Import a graph
							</Button>
							<Button
								loading={isPending}
								onClick={createGraph}
								variant='primary'
								icon={<Plus />}
							>
								Create graph
							</Button>
						</Stack>
					</Stack>
					<TextInput
						value={search}
						placeholder='Filter…'
						type='search'
						leadingVisual={<Search />}
						onChange={e => setSearch(e.target.value)}
					/>
				</Stack>
				<Box css={{ padding: '$2' }}>
					{isLoading && <Spinner />}
					{!isLoading && (
						<Stack direction='column' gap={2}>
							{data?.body &&
								data.body.graphs.length > 0 &&
								data.body.graphs
									.filter(x => x.name.includes(search))
									.map(graph => {
										return (
											<GraphItem
												key={graph.id}
												id={graph.id}
												name={graph.name}
												updatedAt={graph.updatedAt}
											/>
										);
									})}
						</Stack>
					)}
				</Box>
			</Box>
		</Stack>
	);
};

export default Page;
