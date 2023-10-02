// @ts-ignore
import { DeepKeyTokenMap, SingleToken, TokenTypes } from '@tokens-studio/types';
import { setProperty } from 'dot-prop';

export enum TokenType {
  color = 'color',
  spacing = 'spacing',
  sizing = 'sizing',
  border = 'border',
  dimension = 'dimension',
  borderRadius = 'borderRadius',
  borderWidth = 'borderWidth',
  opacity = 'opacity',
  composition = 'composition',
  boxShadow = 'boxShadow',
  fontSizes = 'fontSizes',
  lineHeights = 'lineHeights',
  fontFamilies = 'fontFamilies',
  fontWeights = 'fontWeights',
  typography = 'typography',
  letterSpacing = 'letterSpacing',
  textDecoration = 'textDecoration',
  paragraphSpacing = 'paragraphSpacing',
  textCase = 'textCase',
  other = 'other',
}

export interface IResolvedToken {
  /**
   * Name of the token
   */
  name: string;
  /**
   * Expression that represents the value of the token, botentially jsons stringified
   */
  value: string;
  /**
   * The type of the token
   */
  type: TokenType;
  /**
   * Optional description of the token
   */
  description?: string;
  $extensions?: Record<string, any>;
}

export const flatten = (
  nested: Record<string, IResolvedToken>,
  keyPath: string[] = [],
): IResolvedToken[] => {
  return Object.entries(nested).reduce((acc, [key, val]) => {
    //Check if leaf node
    if (
      val &&
      typeof val.value !== 'undefined' // &&            typeof val.type !== "undefined"
    ) {
      acc.push({
        name: [...keyPath, key].join('.'),
        value: val.value,
        type: val.type,
        description: val.description,
        $extensions: val.$extensions,
      });
      return acc;
    }

    //else continue recursing
    const flattened = flatten(
      val as unknown as Record<string, IResolvedToken>,
      [...keyPath, key],
    );
    acc = acc.concat(flattened);

    return acc;
  }, [] as IResolvedToken[]);
};

export const flatTokensToMap = (tokens: IResolvedToken[]) => {
  return tokens.reduce((acc, token) => {
    acc[token.name] = token;
    return acc;
  }, {} as Record<string, IResolvedToken>);
};

export const flatTokensRestoreToMap = (tokens: IResolvedToken[]) => {
  const returning = {};
  tokens.forEach((token) => {
    const { name, ...rest } = token;
    setProperty(returning, name, {
      ...rest,
    });
  });
  return returning;
};

export type W3CToken = {
  $value: string;
  $type: TokenTypes;
  alpha?: number;
  $extensions?: Record<string, any>;
};
export interface W3CDeepKeyTokenMap {
  [key: string]: W3CDeepKeyTokenMap | W3CToken;
}

export const convertW3CToStudio = (
  obj: W3CDeepKeyTokenMap,
): DeepKeyTokenMap => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (Object.hasOwn(value, '$value')) {
      const val = value as W3CToken;
      const newValue = {
        value: value.$value,
      } as SingleToken;

      if (Object.hasOwn(value, '$type')) {
        //@ts-ignore
        newValue.type = val.$type;
      }
      acc[key] = newValue;
    } else {
      acc[key] = convertW3CToStudio(value as W3CDeepKeyTokenMap);
    }
    return acc;
  }, {} as DeepKeyTokenMap);
};
