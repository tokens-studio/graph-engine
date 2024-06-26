
import 'sanitize.css';
import 'sanitize.css/assets.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/system-ui.css'
import 'sanitize.css/typography.css';
import 'sanitize.css/ui-monospace.css';
import { Metadata } from 'next'
import StitchesProvider from './registry.tsx';
import type { Viewport } from 'next'

import '@/styles/styles.scss';


export const viewport: Viewport = {
    themeColor: '#408ECF',
}

export const metadata: Metadata = {
    title: 'Home',
    description: 'Tokens Studio design tokens playground.',
    authors: [{
        name: 'Tokens Studio',
        url: 'https://tokens.studio'
    }],
    keywords: ['Graph', 'resolvers', 'generator', 'design', 'tokens', 'studio', 'figma'],

    icons: {
        icon: '/favicon.ico',
        apple: '/apple-icon-180x180.png'
    },
    manifest: '/manifest.json',
    twitter: {
        title: 'Resolver playground | Tokens Studio',
        card: 'summary_large_image',
        site: 'https://resolver.dev.tokens.studio',
        creator: '@AndrewAtTokens',
        images: [{
            url: 'https://resolver.dev.tokens.studio/thumbnail.png',
            alt: 'Display picture of Token Studio Resolver Sandbox'
        }]
    },
    applicationName: 'Tokens Studio generator playground',
    referrer: 'origin-when-cross-origin',
    creator: 'SorsOps',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://resolver.dev.tokens.studio',
        title: 'Resolver playground | Tokens Studio',
        description: 'Tokens studio alpha playground to test new resolver / generation functionality',
        images: [{
            url: 'https://resolver.dev.tokens.studio/thumbnail.png',
            alt: 'Display picture of Token Studio Resolver Sandbox'
        }],

    },
}

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <StitchesProvider>
                    {children}
                </StitchesProvider>
            </body>
        </html>
    )
}