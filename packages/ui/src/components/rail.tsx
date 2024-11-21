'use client';
import {
	Avatar,
	IconButton,
	Separator,
	Stack,
	Tooltip
} from '@tokens-studio/ui';
import { GitMerge, Home, Settings, ShoppingBag } from '@tokens-studio/icons';
import { client } from '@/api/sdk/index.ts';
import Image from 'next/image.js';
import Link from 'next/link.js';
import React from 'react';
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
				<IconButton variant='invisible' css={{ padding: '$2' }} icon={icon} />
			</Link>
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
			css={{
				background: '$gray2',
				borderRight: '1px solid $gray6',
				color: '$gray11',
				height: '100%',
				padding: '$5 $3 $3'
			}}
		>
			<Stack gap={3} direction='column' align='center'>
				<Tooltip label={'Tokens Studio'}>
					<Link href='https://tokens.studio'>
						<Image src={TokensStudio} alt='logo' />
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
				<Separator orientation='horizontal' />
				<Avatar src={data?.body?.user?.image ?? ''} />
			</Stack>
		</Stack>
	);
};

export default Rail;
