import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import NextHead from 'next/head.js';
import styles from './Head.module.css';

export const Head = <T extends ElementType = 'body'>({
	title = 'Tokens Studio',
	description = '...',
	as,
	body,
	className,
	...rest
}: {
	title?: string;
	description?: string;
	as?: T;
	body?: ReactNode;
	className?: string;
} & ComponentPropsWithoutRef<T>) => {
	const Component = as || 'body';

	return (
		<>
			<NextHead>
				<meta charSet='utf-8' />
				<title>{title}</title>
				<meta name='description' content={description} />
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<link rel='icon' href='/favicon.ico' />
			</NextHead>
			{body && (
				<Component className={`${styles.body} ${className || ''}`} {...rest}>
					{body}
				</Component>
			)}
		</>
	);
};
