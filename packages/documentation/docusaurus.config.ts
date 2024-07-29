import { themes as prismThemes } from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

const config: Config = {
	title: 'Graph Engine',
	tagline: 'Flow based programming engine',
	favicon: 'img/favicon.ico',

	// Set the production url of your site here
	url: 'https://docs.graph.tokens.studio',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'tokens-studio', // Usually your GitHub org/user name.
	projectName: 'graph-engine', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en']
	},
	markdown: {
		mermaid: true
	},

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/tokens-studio/graph-engine/tree/master/packages/documentation/'
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/tokens-studio/graph-engine/tree/master/packages/documentation/'
				},
				theme: {
					customCss: './src/css/custom.css'
				}
			} satisfies Preset.Options
		]
	],
	themes: ['@docusaurus/theme-mermaid'],
	themeConfig: {
		// Replace with your project's social card
		image: 'img/docusaurus-social-card.jpg',
		navbar: {
			title: 'Graph Engine',
			logo: {
				alt: 'Tokens Studio',
				src: 'img/logo.svg'
			},
			items: [
				{
					type: 'docSidebar',
					sidebarId: 'tutorialSidebar',
					position: 'left',
					label: 'Docs'
				},
				{
					href: 'https://github.com/tokens-studio/graph-engine',
					label: 'GitHub',
					position: 'right'
				}
			]
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Tutorial',
							to: '/docs/'
						}
					]
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Slack',
							href: 'https://tokens.studio/slack'
						},
						{
							label: 'Youtube',
							href: 'https://www.youtube.com/@TokensStudio'
						}
					]
				},
				{
					title: 'More',
					items: [
						{
							label: 'GitHub',
							href: 'https://github.com/facebook/docusaurus'
						}
					]
				}
			],
			copyright: `Copyright © ${new Date().getFullYear()} Tokens Studio. Built with Docusaurus.`
		},
		mermaid: {
			theme: { light: 'neutral', dark: 'forest' }
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula
		}
	} satisfies Preset.ThemeConfig
};

export default config;
