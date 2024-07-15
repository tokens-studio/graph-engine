import {
  ANY,
  BOOLEAN,
  COLOR,
  CURVE,
  NUMBER,
  OBJECT,
  STRING,
} from '@tokens-studio/graph-engine';

export default {
  [COLOR]: {
    color: 'hsl(250, 100%, 10%)',
    backgroundColor: 'hsl(3, 60%, 60%)',
  },
  [CURVE]: {
    color: '#e8e2d9',
    backgroundColor: 'hsl(300, 60%, 30%)',
  },
  [BOOLEAN]: {
    color: '#ffe7b3',
    backgroundColor: 'hsl(30, 60%, 60%)',
  },
  [NUMBER]: {
    color: '#c2e6ff',
    backgroundColor: 'hsl(210, 60%, 60%)',
  },
  [STRING]: {
    color: '#e3f7ba',
    backgroundColor: 'hsl(90, 60%, 60%)',
  },
  [ANY]: {
    color: '#fdd1ea',
    backgroundColor: 'hsl(250, 60%, 60%)',
  },
  [OBJECT]: {
    color: '#adf0dd',
    backgroundColor: 'hsl(170, 60%, 60%)',
  },
};
