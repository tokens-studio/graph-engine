import { Container } from '@/components/container/index.tsx';
import { Stack } from '@tokens-studio/ui/Stack.js';
import Rail from '@/components/rail.tsx';

export default function Layout({ children }) {
	return (
		<Stack style={{ height: '100%', width: '100%' }}>
			<div>
				<Rail />
			</div>
			<div style={{ flex: '1' }}>
				<Container>{children}</Container>
			</div>
		</Stack>
	);
}
