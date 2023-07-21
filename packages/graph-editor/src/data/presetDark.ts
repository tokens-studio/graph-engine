export default {
  fg: {
    default: {
      value: '{colors.white}',
      type: 'color',
    },
    muted: {
      value: '{colors.gray.300}',
      type: 'color',
    },
    subtle: {
      value: '{colors.gray.500}',
      type: 'color',
    },
  },
  bg: {
    default: {
      value: '{colors.gray.900}',
      type: 'color',
    },
    muted: {
      value: '{colors.gray.700}',
      type: 'color',
    },
    subtle: {
      value: '{colors.gray.600}',
      type: 'color',
    },
  },
  accent: {
    default: {
      value: '{colors.indigo.600}',
      type: 'color',
    },
    onAccent: {
      value: '{colors.white}',
      type: 'color',
    },
    bg: {
      value: '{colors.indigo.800}',
      type: 'color',
    },
  },
  shadows: {
    default: {
      value: 'rgba({colors.black}, 0.3)',
      type: 'color',
    },
  },
};
