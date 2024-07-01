import {  ANY, COLOR, CURVE, STRING, BOOLEAN, NUMBER, OBJECT } from '@tokens-studio/graph-engine'

/* eslint-disable import/no-anonymous-default-export */
export default {
  [COLOR]: {
    color: 'hsl(250, 100%, 10%)',
    backgroundColor: 'hsl(3, 80%, 60%)',
  },
  [CURVE]: {
    color: 'var(--gold-12)',
    backgroundColor: 'var(--gold-8)',
  },
  [BOOLEAN]: {
    color: 'var(--amber-12)',
    backgroundColor: 'hsl(30, 80%, 60%)',
  },
  [NUMBER]: {
    color: 'var(--blue-12)',
    backgroundColor: 'hsl(210, 80%, 60%)',
  },
  [STRING]: {
    color: 'var(--lime-12)',
    backgroundColor: 'hsl(90, 80%, 60%)',
  },
  [ANY]: {
    color: 'var(--pink-12)',
    backgroundColor: 'hsl(250, 80%, 60%)',
  },
  [OBJECT]: {
    color: 'var(--teal-12)',
    backgroundColor: 'hsl(170, 80%, 60%)',
  }
};
