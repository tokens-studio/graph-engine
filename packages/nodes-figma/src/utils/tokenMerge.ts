import { SingleToken } from '@tokens-studio/types';

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface FigmaExtension {
	hiddenFromPublishing?: boolean;
	codeSyntax?: Record<string, string>;
	scopes?: string[];
	[key: string]: unknown;
}

export function mergeTokenExtensions(
	token: SingleToken,
	figmaExtension: DeepPartial<FigmaExtension>
): SingleToken {
	const existingExtensions = token.$extensions || {};
	const existingFigmaExt = existingExtensions['com.figma'] || {};

	const mergedFigmaExt = {
		...existingFigmaExt,
		...figmaExtension,
		...(figmaExtension.codeSyntax && {
			codeSyntax: {
				...existingFigmaExt.codeSyntax,
				...figmaExtension.codeSyntax
			}
		}),
		...(figmaExtension.scopes && {
			scopes: [
				...new Set([
					...(existingFigmaExt.scopes || []),
					...(figmaExtension.scopes || [])
				])
			]
		})
	};

	return {
		...token,
		$extensions: {
			...existingExtensions,
			'com.figma': mergedFigmaExt
		}
	} as unknown as SingleToken;
}
