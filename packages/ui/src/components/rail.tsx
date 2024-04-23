import React from 'react';
import { Home, GitMerge, ShoppingBag, Settings, HeadsetHelp } from 'iconoir-react';
import { Avatar, Link, Separator, Stack } from '@tokens-studio/ui';
import TokensStudio from '@/assets/svgs/tokensstudio-logo.svg';

interface RailItem {
  icon: React.ReactNode;
  label: string;
  link: string;
}

const railItemsStart: RailItem[] = [
  { icon: <Home/>, label: 'Home', link: '/' },
  { icon: <GitMerge/>, label: 'Editor', link: '/' },
  { icon: <ShoppingBag/>, label: 'Marketplace', link: '/' }
];

const railItemsEnd: RailItem[] = [
  { icon: <Settings/>, label: 'Settings', link: '/' },
  { icon: <HeadsetHelp/>, label: 'Help', link: '/' },
];

const RailItem = ({ icon, label, link }: RailItem) => {
  return (
    <Link css={{color: '$fgOnEmphasis', padding: '$2'}} aria-label={label} href={link}>
      {icon}
    </Link>
  );
}

export const Rail = () => {
  return (
    <Stack justify='between' direction='column' css={{background: '$bgEmphasis', borderRight: '1px solid $borderSubtle', color: '$fgOnEmphasis', height: '100%', padding: '$5 $3 $3'}}>
      <Stack gap={3} direction='column' align='center'>
        <TokensStudio style={{width: 'var(--sizes-6)', height: 'auto', aspectRatio: '1/1'}} />
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
