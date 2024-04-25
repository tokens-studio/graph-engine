import React from 'react';
import { Home, GitMerge, ShoppingBag, Settings, HeadsetHelp } from 'iconoir-react';
import { Avatar,Box, Separator, Stack, Tooltip } from '@tokens-studio/ui';
import Link from 'next/link'
import TokensStudio from '@/assets/svgs/tokensstudio-logo.svg';

interface RailItem {
  icon: React.ReactNode;
  label: string;
  link: string;
}

const railItemsStart: RailItem[] = [
  { icon: <Home />, label: 'Home', link: '/' },
  { icon: <GitMerge />, label: 'Editor', link: '/editor' },
  { icon: <ShoppingBag />, label: 'Marketplace', link: '/marketplace' }
];

const railItemsEnd: RailItem[] = [
  { icon: <Settings />, label: 'Settings', link: '/settings' },
  { icon: <HeadsetHelp />, label: 'Help', link: '/help' },
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
    <Stack justify='between' direction='column' css={{ background: '$bgEmphasis', borderRight: '1px solid $borderSubtle', color: '$fgOnEmphasis', height: '100%', padding: '$5 $3 $3' }}>
      <Stack gap={3} direction='column' align='center'>
        <TokensStudio style={{ width: 'var(--sizes-6)', height: 'auto', aspectRatio: '1/1' }} />
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
  );
};

export default Rail;
