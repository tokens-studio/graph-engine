import '@/styles/styles.scss';
import '@tokens-studio/graph-editor/index.css';

import '@tokens-studio/tokens/css/base.css';
import '@tokens-studio/tokens/css/light.css';
import '@tokens-studio/ui/normalize.css';

import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';
import '@fontsource/geist-mono/700.css';

import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/700.css';

import { headers } from 'next/headers.js';
import type { Viewport } from 'next';

export const viewport: Viewport = {
	themeColor: '#408ECF'
};

export async function generateMetadata() {
	const origin = headers().get('host') || 'localhost:3000';
	const protocol = headers().get('x-forwarded-proto') || 'http';

	return {
		metadataBase: new URL(`${protocol}://${origin}`),
		title: 'Home',
		description: 'Tokens Studio design tokens playground.',
		authors: [
			{
				name: 'Tokens Studio',
				url: 'https://tokens.studio'
			}
		],
		keywords: [
			'Graph',
			'resolvers',
			'generator',
			'design',
			'tokens',
			'studio',
			'figma'
		],

		icons: {
			icon: '/favicon.ico',
			apple: '/apple-icon-180x180.png'
		},
		manifest: '/manifest.json',
		twitter: {
			title: 'Graph Engine Playground - Algorithmic Design by Tokens Studio',
			card: 'summary_large_image',
			creator: '@mikekamminga',
			images: [
				{
					url: `/thumbnail.png`,
					alt: 'Display picture of Token Studio Graph Engine Playground'
				}
			]
		},
		applicationName: 'Graph Engine Playground',
		referrer: 'origin-when-cross-origin',
		creator: 'MikeKamminga',
		openGraph: {
			type: 'website',
			locale: 'en_US',
			title: 'Graph Engine Playground - Algorithmic Design by Tokens Studio',
			description:
				'Use our Node Editor to define the logic behind your design and have Design Tokens generated in real-time & effortlessly import them to Figma Variables.',
			images: [
				{
					url: `/thumbnail.png`,
					alt: 'Display picture of Token Studio Graph Engine Playground'
				}
			]
		}
	};
}

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className='dark'>{children}</body>
		</html>
	);
}
