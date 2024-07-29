//@ts-ignore
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { styled } from '@/lib/stitches/index.ts';
import NextHead from 'next/head.js';

export const Head = <T extends ElementType = 'body'>({
	title = 'Tokens Studio',
	description = '...',
	as,
	body,
	...rest
}: {
	title?: string;
	description?: string;
	as?: T;
	body?: ReactNode;
} & ComponentPropsWithoutRef<T>) => {
	const Body = styled(as || 'body');
	return (
		<>
			{/* @ts-ignore */}
			<NextHead>
				<meta charSet='utf-8' />
				<title>{title}</title>
				<meta name='description' content={description} />
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<link rel='icon' href='/favicon.ico' />
			</NextHead>
			{body && <Body {...rest}>{body}</Body>}
		</>
	);
};
