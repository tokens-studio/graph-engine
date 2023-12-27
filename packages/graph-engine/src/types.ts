export type ExternalLoadOptions = { type: string; id: string; data: any };
export type ExternalLoader = (opts: ExternalLoadOptions) => Promise<any> | any;

export enum NodeTypes {
  INPUT = "studio.tokens.generic.input",
  OUTPUT = "studio.tokens.generic.output",
  SUBGRAPH = "studio.tokens.generic.subgraph",
  ARRAY = "studio.tokens.generic.array",
  PASS_THROUGH = "studio.tokens.generic.passthrough",

  CONSTANT = "studio.tokens.input.constant",
  SLIDER = "studio.tokens.input.slider",
  SPREAD = "studio.tokens.input.extract",
  OBJECTIFY = "studio.tokens.input.objectify",
  JSON = "studio.tokens.input.json",

  CSS_MAP = "studio.tokens.css.map",
  CSS_BOX = "studio.tokens.css.box",
  CSS_FUNCTIONS = "studio.tokens.css.function",

  //Curves
  SAMPLE_CURVE = "studio.tokens.curve.sample",

  //Logic
  IF = "studio.tokens.logic.if",
  NOT = "studio.tokens.logic.not",
  AND = "studio.tokens.logic.and",
  OR = "studio.tokens.logic.or",
  SWITCH = "studio.tokens.logic.switch",
  COMPARE = "studio.tokens.logic.compare",

  //Array
  ARRAY_INDEX = "studio.tokens.array.index",
  ARRIFY = "studio.tokens.array.arrify",
  REVERSE = "studio.tokens.array.reverse",
  SLICE = "studio.tokens.array.slice",
  SORT = "studio.tokens.array.sort",
  JOIN = "studio.tokens.array.join",
  CONCAT = "studio.tokens.array.concat",
  DOT_PROP = "studio.tokens.array.dotProp",
  ARRAY_PASS_UNIT = "studio.tokens.array.passUnit",
  NAME = "studio.tokens.array.name",

  // Math
  ADD = "studio.tokens.math.add",
  SUBTRACT = "studio.tokens.math.subtract",
  MULTIPLY = "studio.tokens.math.multiply",
  DIV = "studio.tokens.math.divide",
  ABS = "studio.tokens.math.abs",
  ROUND = "studio.tokens.math.round",
  SIN = "studio.tokens.math.sin",
  COS = "studio.tokens.math.cos",
  TAN = "studio.tokens.math.tan",
  LERP = "studio.tokens.math.lerp",
  CLAMP = "studio.tokens.math.clamp",
  MOD = "studio.tokens.math.mod",
  RANDOM = "studio.tokens.math.random",
  COUNT = "studio.tokens.math.count",
  POW = "studio.tokens.math.pow",
  FLUID_VALUE = "studio.tokens.math.fluid",

  // Color
  CONTRASTING = "studio.tokens.color.contrasting",
  CONTRASTING_FROM_SET = "studio.tokens.color.contrastingFromSet",
  SCALE = "studio.tokens.color.scale",
  CONVERT_COLOR = "studio.tokens.color.convert",
  BLEND = "studio.tokens.color.blend",
  ADVANCED_BLEND = "studio.tokens.color.blendAdv",
  CREATE_COLOR = "studio.tokens.color.create",
  EXTRACT = "studio.tokens.color.extract",
  TRANSFORM_COLOR = "studio.tokens.color.transform",
  WHEEL = "studio.tokens.color.wheel",
  POLINE = "studio.tokens.color.poline",
  COLOR_DISTANCE = "studio.tokens.color.distance",
  COLOR_NAME = "studio.tokens.color.name",
  NEAREST_TOKENS = "studio.tokens.color.nearestTokens",
  SET_COLOR_LUMINANCE = "studio.tokens.color.setColorLuminance",

  //Sets
  FLATTEN = "studio.tokens.sets.flatten",
  ALIAS = "studio.tokens.sets.alias",
  REMAP = "studio.tokens.sets.remap",
  INLINE_SET = "studio.tokens.sets.inline",
  SET = "studio.tokens.sets.external",
  INVERT_SET = "studio.tokens.sets.invert",
  GROUP = "studio.tokens.sets.group",
  UNGROUP = "studio.tokens.sets.ungroup",
  EXTRACT_SINGLE_TOKEN = "studio.tokens.sets.extractSingleToken",
  EXTRACT_TOKENS = "studio.tokens.sets.extractTokens",

  //Series
  ARITHMETIC_SERIES = "studio.tokens.series.arithmetic",
  HARMONIC_SERIES = "studio.tokens.series.harmonic",
  GEOMETRIC_SERIES = "studio.tokens.series.geometric",

  //String
  UPPERCASE = "studio.tokens.string.uppercase",
  JOIN_STRING = "studio.tokens.string.join",
  SPLIT_STRING = "studio.tokens.string.split",
  LOWER = "studio.tokens.string.lowercase",
  REGEX = "studio.tokens.string.regex",
  PASS_UNIT = "studio.tokens.typing.passUnit",
  PARSE_UNIT = "studio.tokens.typing.parseUnit",
  STRINGIFY = "studio.tokens.string.stringify",

  //Accessibility
  CONTRAST = "studio.tokens.accessibility.contrast",
  COLOR_BLINDNESS = "studio.tokens.accessibility.colorBlindness",
  BASE_FONT_SIZE = "studio.tokens.accessibility.baseFontSize",
}
