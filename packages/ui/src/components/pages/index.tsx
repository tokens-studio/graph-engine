'use client';
import { Button, Heading, Text } from '@tokens-studio/ui';
import Image from 'next/image.js';
import Link from 'next/link.js';
import Logo from '@/assets/svgs/tokensstudio-logo.svg';
import styles from './index.module.css';

export default function Index() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.card}>
				<Image src={Logo} alt='Tokens Studio Logo' width={64} height={64} />
				<Heading size='large'>Important </Heading>

				<Text>
					This project is still in beta and subject to substantial changes.
					There is no guarantee that existing features or behaviour might remain
					in its final state. This is a raw unfiltered window into its
					development
				</Text>

				<Link href='/api/auth/signin'>
					<Button emphasis='high'>Goto login</Button>
				</Link>
			</div>
		</div>
	);
}
