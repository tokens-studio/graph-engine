'use client';

import { getCssText } from '@tokens-studio/graph-editor';
import { useServerInsertedHTML } from 'next/navigation.js';
import React from 'react';

export default function StitchesProvider({
	children
}: {
	children: React.ReactNode;
}) {
	useServerInsertedHTML(() => {
		return <style id='stitches'>{getCssText()}</style>;
	});

	return <>{children}</>;
}
