import { Stack } from '@tokens-studio/ui/Stack.js';
import styles from './layout.module.css';

export const Container = ({ children }) => {
	return (
		<Stack className={styles.container} justify='center'>
			<div className={styles.holder}>{children}</div>
		</Stack>
	);
};
