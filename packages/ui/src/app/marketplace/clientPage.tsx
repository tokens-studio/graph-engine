'use client';
import { Heading, Separator, Spinner, Stack, Text } from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import Download from '@tokens-studio/icons/Download.js';
import Heart from '@tokens-studio/icons/Heart.js';
import Link from 'next/link.js';
import styles from './clientPage.module.css';

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
					<Stack
						style={{ flexWrap: 'wrap', padding: 'var(--component-spacing-sm)' }}
					>
						{data?.body.graphs.map(graph => (
							<div className={styles.wrapper} key={graph.id}>
								<Link href={`/marketplace/graph/${graph.id}`}>
									<div>
										<div className={styles.imageHolder}>
											<img
												className={styles.previewImage}
												src={graph.thumbnail || '/thumbnail.png'}
												alt='Display picture of Token Studio Resolver Sandbox'
											/>
										</div>
										<div className={styles.itemPadding}>
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
										</div>
									</div>
								</Link>
							</div>
						))}
					</Stack>
				</>
			)}
		</Stack>
	);
};

export default Page;
