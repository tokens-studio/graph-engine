'use client';
import {
	Box,
	Heading,
	Separator,
	Spinner,
	Stack,
	Text
} from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import { styled } from '@tokens-studio/graph-editor';
import { useErrorToast } from '@/hooks/useToast.tsx';
import Download from '@tokens-studio/icons/Download.js';
import Heart from '@tokens-studio/icons/Heart.js';
import Link from 'next/link.js';

const Wrapper = styled(Box, {
	flex: '33%',
	maxWidth: '33%',
	padding: '$3'
});

export const Item = styled(Box, {});

export const ImageHolder = styled(Box, {
	paddingBottom: '50%',
	position: 'relative'
});

export const PreviewImage = styled('img', {
	position: 'absolute',
	width: '100%',
	height: '100%',
	display: 'block'
});

const Page = () => {
	const { isLoading, data, error } = client.marketplace.listGraphs.useQuery([
		'market',
		'listGraphs'
	]);

	useErrorToast(error);

	return (
		<Stack direction='column' width='full' gap={3}>
			<Heading size='large'>Showcase</Heading>
			<Separator orientation='horizontal' />
			{isLoading && <Spinner />}
			{!isLoading && (
				<>
					<Stack css={{ flexWrap: 'wrap', padding: '$3' }}>
						{data?.body.graphs.map(graph => (
							<Wrapper key={graph.id}>
								<Link href={`/marketplace/graph/${graph.id}`}>
									<Item>
										<ImageHolder>
											<PreviewImage
												src={graph.thumbnail || '/thumbnail.png'}
												alt='Display picture of Token Studio Resolver Sandbox'
											/>
										</ImageHolder>
										<Box css={{ padding: '$3' }}>
											<Text>{graph.name}</Text>

											<Stack direction='row' width='full' justify='between'>
												<Stack direction='row' gap={2}>
													<Text muted size='xsmall'>
														by{' '}
													</Text>
													<Text muted size='xsmall'>
														{graph.user.name}
													</Text>
												</Stack>
												<Stack gap={2}>
													<Text muted size='xsmall'>
														<Download /> {graph.downloads}
													</Text>
													<Text muted size='xsmall'>
														<Heart /> {graph.likes}
													</Text>
												</Stack>
											</Stack>
										</Box>
									</Item>
								</Link>
							</Wrapper>
						))}
					</Stack>
				</>
			)}
		</Stack>
	);
};

export default Page;
