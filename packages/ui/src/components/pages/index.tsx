'use client';
import { Box, Button, Heading, Stack, Text } from '@tokens-studio/ui';
import Image from 'next/image.js';
import Link from 'next/link.js';
import Logo from '@/assets/svgs/tokensstudio-logo.svg';

export default function Index() {
	return (
		<Stack
			direction='row'
			align='center'
			css={{ height: '100%', width: '100%' }}
			justify='center'
		>
			<Box
				css={{ background: '$bgCanvas', padding: '$5', borderRadius: '$small' }}
			>
				<Stack
					direction='column'
					gap={6}
					align='center'
					css={{ maxWidth: '300px' }}
				>
					<Image src={Logo} alt='Tokens Studio Logo' width={100} height={100} />
					<Heading size='large'>Important </Heading>

					<Text>
						This project is still in beta and subject to substantial changes.
						There is no guarantee that existing features or behaviour might
						remain in its final state. This is a raw unfiltered window into its
						development
					</Text>

					<Link href='/api/auth/signin'>
						<Button variant='primary'>Goto login</Button>
					</Link>
				</Stack>
			</Box>
		</Stack>
	);
}
