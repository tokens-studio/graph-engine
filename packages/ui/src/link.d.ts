//Not sure why the link is breaking in the next.js package, but this is a workaround to fix it
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module 'next/link.js' {
	import React from 'react';

	const Link: React.FC<{
		href: string;
		children: React.ReactNode;
		[key: string]: any;
	}> = _ => JSX.Element;
	export default Link;
}
