'use client';

import { HydrateProps, Hydrate as OgHydrate } from '@tanstack/react-query';

export function Hydrate(props: HydrateProps) {
	return <OgHydrate {...props} />;
}
