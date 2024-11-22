import * as Popover from '@radix-ui/react-popover';
import { Box, IconButton, Label, Stack, TextInput } from '@tokens-studio/ui';
import { styled } from '@tokens-studio/graph-editor';
import Copy from '@tokens-studio/icons/Copy.js';
import React from 'react';
import Xmark from '@tokens-studio/icons/Xmark.js';
import copy from 'copy-to-clipboard';

const PopoverContent = styled(Popover.Content, {
	borderRadius: '$medium',
	border: '1px solid $borderSubtle',
	padding: 0,
	width: 300,
	backgroundColor: '$bgDefault',
	boxShadow:
		'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	animationDuration: '400ms',
	animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
	willChange: 'transform, opacity',
	'&:focus': {
		boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px black`
	}
});

const PopoverArrow = styled(Popover.Arrow, {
	fill: '$bgDefault'
});

const PopoverClose = styled(Popover.Close, {
	all: 'unset',
	cursor: 'pointer',
	fontFamily: 'inherit',
	borderRadius: '100%',
	height: 25,
	width: 25,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '$fgDefault',
	position: 'absolute',
	top: 5,
	right: 5
});

export const SharePopover = ({ children, open, link, onClose }) => {
	const onClick = () => {
		copy(link);
	};

	return (
		<Popover.Root open={open} onOpenChange={onClose}>
			<Popover.Anchor>{children}</Popover.Anchor>
			<Popover.Portal>
				<PopoverContent>
					<Box css={{ padding: '$3' }}>
						<Stack gap={2} direction='column'>
							<Label>Share link</Label>
							<Stack gap={2}>
								<TextInput value={link} />
								<IconButton onClick={onClick} icon={<Copy />} />
							</Stack>
						</Stack>
					</Box>
					<PopoverClose aria-label='Close'>
						<Xmark />
					</PopoverClose>
					<PopoverArrow />
				</PopoverContent>
			</Popover.Portal>
		</Popover.Root>
	);
};
