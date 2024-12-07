import { Button } from '@tokens-studio/ui/Button.js';
import { Heading } from '@tokens-studio/ui/Heading.js';
import { Separator } from '@tokens-studio/ui/Separator.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import Inner from './clientPage.tsx';
import Link from 'next/link.js';

const Page = () => {
	return (
		<Stack direction='column' width='full' gap={3}>
			<Heading size='large'>Public profile</Heading>
			<Separator />
			<Inner />
			<Heading size='large'>Actions</Heading>
			<Separator />
			<Link href='/api/auth/signout'>
				<Button>Sign out</Button>
			</Link>
		</Stack>
	);
};

export default Page;
