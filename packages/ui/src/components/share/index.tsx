import * as Popover from '@radix-ui/react-popover';
import { Copy, Xmark } from 'iconoir-react';
import { IconButton, Label, Stack, TextInput } from '@tokens-studio/ui';
import React from 'react';
import copy from 'copy-to-clipboard';
import styles from './index.module.css';

export const SharePopover = ({ children, open, link, onClose }) => {
	const onClick = () => {
		copy(link);
	};

	return (
		<Popover.Root open={open} onOpenChange={onClose}>
			<Popover.Anchor>{children}</Popover.Anchor>
			<Popover.Portal>
				<Popover.Content className={styles.popoverContent}>
					<div className={styles.contentPadding}>
						<Stack gap={2} direction='column'>
							<Label>Share link</Label>
							<Stack gap={2}>
								<TextInput value={link} />
								<IconButton onClick={onClick} icon={<Copy />} />
							</Stack>
						</Stack>
					</div>
					<Popover.Close className={styles.popoverClose} aria-label='Close'>
						<Xmark />
					</Popover.Close>
					<Popover.Arrow className={styles.popoverArrow} />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
};
