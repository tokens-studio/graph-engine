import { auth } from '@/auth/index.ts';
import { redirect } from 'next/navigation.js';
import IndexPage from '@/components/pages/index.tsx';

export default async function Index() {
	const session = await auth();
	if (session?.user) {
		return redirect('/editor');
	}

	return <IndexPage />;
}
