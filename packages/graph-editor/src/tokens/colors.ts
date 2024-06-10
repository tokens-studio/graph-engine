import {  ANY, COLOR, STRING, BOOLEAN, NUMBER, VARIADIC_NUMBER, VARIADIC_COLOR, VARIADIC_ANY } from '@tokens-studio/graph-engine'

/* eslint-disable import/no-anonymous-default-export */
export default {
  [COLOR]: {
    color: 'oklch(20% 0.1 90)',
    backgroundColor: 'var(--purple-9)',
  },
  [VARIADIC_COLOR]: {
    color: 'oklch(20% 0.1 90)',
    backgroundColor: 'var(--purple-9)',
  },
  [BOOLEAN]: {
    color: 'oklch(20% 0.1 120)',
    backgroundColor: 'oklch(80% 0.25 120)',
  },
  [NUMBER]: {
    color: 'oklch(20% 0.1 30)',
    backgroundColor: 'oklch(80% 0.25 30)',
  },
  [VARIADIC_NUMBER]: {
    color: 'oklch(20% 0.1 30)',
    backgroundColor: 'oklch(80% 0.25 30)',
  },
  [STRING]: {
    color: 'oklch(20% 0.1 270)',
    backgroundColor: 'oklch(80% 0.25 270)',
  },
  [ANY]: {
    color: 'oklch(20% 0.1 180)',
    backgroundColor: 'oklch(80% 0.25 180)',
  },
  [VARIADIC_ANY]: {
    color: 'oklch(20% 0.1 180)',
    backgroundColor: 'oklch(80% 0.25 180)',
  },
};
