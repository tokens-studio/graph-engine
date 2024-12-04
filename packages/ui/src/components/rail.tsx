'use client';
import {
	Avatar,
	IconButton,
	Separator,
	Stack,
	Tooltip
} from '@tokens-studio/ui';
import { client } from '@/api/sdk/index.ts';
import GitMerge from '@tokens-studio/icons/GitMerge.js';
import HalfMoon from '@tokens-studio/icons/HalfMoon.js';
import Home from '@tokens-studio/icons/Home.js';
import Image from 'next/image.js';
import Link from 'next/link.js';
import React, { useEffect, useState } from 'react';
import Settings from '@tokens-studio/icons/Settings.js';
import ShoppingBag from '@tokens-studio/icons/ShoppingBag.js';
import SunLight from '@tokens-studio/icons/SunLight.js';
import TokensStudio from '@/assets/svgs/tokensstudio-logo.svg';

interface RailItem {
	icon: React.ReactNode;
	label: string;
	link: string;
}

const railItemsStart: RailItem[] = [
	{ icon: <Home />, label: 'Home', link: '/dashboard' },
	{ icon: <GitMerge />, label: 'Editor', link: '/editor' },
	{ icon: <ShoppingBag />, label: 'Showcase', link: '/marketplace' }
];

const railItemsEnd: RailItem[] = [
	{ icon: <Settings />, label: 'Settings', link: '/dashboard/settings' }
	// { icon: <HeadsetHelp />, label: 'Help', link: '/dashboard/help' },
];

const RailItem = ({ icon, label, link }: RailItem) => {
	return (
		<Tooltip label={label}>
			<Link aria-label={label} href={link}>
				<IconButton
					emphasis='low'
					style={{ padding: 'var(--component-spacing-sm)' }}
					icon={icon}
				/>
			</Link>
		</Tooltip>
	);
};

const ThemeToggle = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Check initial theme on mount
		const isDarkMode = document.body.classList.contains('ts-theme-dark');
		setIsDark(isDarkMode);
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);

		document.body.classList.remove(
			newIsDark ? 'ts-theme-light' : 'ts-theme-dark'
		);
		document.body.classList.add(newIsDark ? 'ts-theme-dark' : 'ts-theme-light');
	};

	return (
		<Tooltip label={isDark ? 'Light Mode' : 'Dark Mode'}>
			<IconButton
				emphasis='low'
				style={{ padding: 'var(--component-spacing-sm)' }}
				onClick={toggleTheme}
				icon={isDark ? <SunLight /> : <HalfMoon />}
			/>
		</Tooltip>
	);
};

export interface RailProps {
	avatar?: string;
}

export interface RailProps {
	avatar?: string;
}

export const Rail = () => {
	const { data } = client.auth.getWhoAmI.useQuery(
		['getWhoAmI'],
		{},
		{
			staleTime: 1000 * 60 * 5
		}
	);
	return (
		<Stack
			justify='between'
			direction='column'
			style={{
				background: 'var(--color-neutral-canvas-minimal-bg)',
				borderRight: '1px solid var(--color-neutral-stroke-default)',
				color: 'var(--color-neutral-canvas-minimal-fg-default)',
				height: '100%',
				padding:
					'var(--component-spacing-xl) var(--component-spacing-md) var(--component-spacing-md)'
			}}
		>
			<Stack gap={3} direction='column' align='center'>
				<Tooltip label={'Tokens Studio'}>
					<Link href='https://tokens.studio'>
						<Image src={TokensStudio} alt='logo' width={24} />
					</Link>
				</Tooltip>
				{railItemsStart.map(item => (
					<RailItem
						key={item.label}
						icon={item.icon}
						label={item.label}
						link={item.link}
					/>
				))}
			</Stack>

			<Stack gap={3} direction='column' align='center'>
				{railItemsEnd.map(item => (
					<RailItem
						key={item.label}
						icon={item.icon}
						label={item.label}
						link={item.link}
					/>
				))}
				<ThemeToggle />
				<Separator orientation='horizontal' />
				<Avatar src={data?.body?.user?.image ?? ''} />
			</Stack>
		</Stack>
	);
};

export default Rail;
