import {  ANY, COLOR, CURVE, STRING, BOOLEAN, NUMBER, OBJECT } from '@tokens-studio/graph-engine'

/* eslint-disable import/no-anonymous-default-export */
export default {
  [COLOR]: {
    color: 'var(--violet-12)',
    backgroundColor: 'var(--violet-8)',
  },
  [CURVE]: {
    color: 'var(--gold-12)',
    backgroundColor: 'var(--gold-8)',
  },
  [BOOLEAN]: {
    color: 'var(--amber-12)',
    backgroundColor: 'var(--amber-8)',
  },
  [NUMBER]: {
    color: 'var(--blue-12)',
    backgroundColor: 'var(--blue-8)',
  },
  [STRING]: {
    color: 'var(--lime-12)',
    backgroundColor: 'var(--lime-8)',
  },
  [ANY]: {
    color: 'var(--pink-12)',
    backgroundColor: 'var(--pink-8)',
  },
  [OBJECT]: {
    color: 'var(--teal-12)',
    backgroundColor: 'var(--teal-8)',
  }
};
