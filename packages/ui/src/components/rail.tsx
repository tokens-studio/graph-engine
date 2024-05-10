import React from 'react';
import { Home, GitMerge, ShoppingBag, Settings, HeadsetHelp } from 'iconoir-react';
import { Avatar, Box, Separator, Stack, Tooltip } from '@tokens-studio/ui';
import Link from 'next/link.js'
import TokensStudio from '@/assets/svgs/tokensstudio-logo.svg';
import Image from 'next/image.js';

interface RailItem {
  icon: React.ReactNode;
  label: string;
  link: string;
}

const railItemsStart: RailItem[] = [
  { icon: <Home />, label: 'Home', link: '/dashboard' },
  { icon: <GitMerge />, label: 'Editor', link: '/dashboard/editor' },
  { icon: <ShoppingBag />, label: 'Marketplace', link: '/dashboard/marketplace' }
];

const railItemsEnd: RailItem[] = [
  { icon: <Settings />, label: 'Settings', link: '/dashboard/settings' },
  { icon: <HeadsetHelp />, label: 'Help', link: '/dashboard/help' },
];

const RailItem = ({ icon, label, link }: RailItem) => {
  return (
    <Tooltip label={label}>
      <Link aria-label={label} href={link}>
        <Box css={{ color: '$fgOnEmphasis', padding: '$2' }}>
          {icon}
        </Box>
      </Link>
    </Tooltip >
  );
}

export const Rail = () => {


  return (
    <Tooltip.Provider>
      <Stack justify='between' direction='column' css={{ background: '$gray2', borderRight: '1px solid $gray6', color: '$gray11', height: '100%', padding: '$5 $3 $3' }}>
        <Stack gap={3} direction='column' align='center'>
          <Tooltip label={'Tokens Studio'}>
            <Link href='https://tokens.studio'>
              <Image src={TokensStudio} alt='logo' />
            </Link>
          </Tooltip>
          {railItemsStart.map((item) => (
            <RailItem key={item.label} icon={item.icon} label={item.label} link={item.link} />
          ))}
        </Stack>

        <Stack gap={3} direction='column' align='center' >
          {railItemsEnd.map((item) => (

            <RailItem key={item.label} icon={item.icon} label={item.label} link={item.link} />

          ))}
          <Separator orientation='horizontal' />
          <Avatar src='https://xsgames.co/randomusers/assets/avatars/female/20.jpg' />
        </Stack>
      </Stack>
    </Tooltip.Provider>
  );
};

export default Rail;
