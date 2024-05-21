export type ExternalLoadOptions = { type: string; id: string; data: any };
export type ExternalLoader = (opts: ExternalLoadOptions) => Promise<any> | any;

export enum NodeTypes {
  INPUT = "studio.tokens.generic.input",
  NOTE = "studio.tokens.generic.note",
  INLINE = "studio.tokens.generic.inline",
  OUTPUT = "studio.tokens.generic.output",
  SUBGRAPH = "studio.tokens.generic.subgraph",
  ARRAY = "studio.tokens.generic.array",
  REDUCE = "studio.tokens.generic.reduce",
  PASS_THROUGH = "studio.tokens.generic.passthrough",
  PANIC = "studio.tokens.generic.panic",
  CONSTANT = "studio.tokens.generic.constant",
  OBJECTIFY = "studio.tokens.generic.objectify",
  MERGE_OBJECTS = "studio.tokens.generic.mergeObjects",
  PREVIEW = "studio.tokens.generic.preview",

  SPREAD = "studio.tokens.input.extract",

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
  ARRAY_PUSH = "studio.tokens.array.push",
  NAME = "studio.tokens.array.name",

  // Math
  ADD = "studio.tokens.math.add",
  ADD_VARIADIC = "studio.tokens.math.addVariadic",
  EVAL = "studio.tokens.math.eval",
  SUBTRACT = "studio.tokens.math.subtract",
  SUBTRACT_VARIADIC = "studio.tokens.math.subtractVariadic",
  MULTIPLY = "studio.tokens.math.multiply",
  MULTIPLY_VARIADIC = "studio.tokens.math.multiplyVariadic",
  DIV = "studio.tokens.math.divide",
  DIV_VARIADIC = "studio.tokens.math.divideVariadic",
  ABS = "studio.tokens.math.abs",
  ROUND = "studio.tokens.math.round",
  FLOOR = "studio.tokens.math.floor",
  CEIL = "studio.tokens.math.ceil",
  SIN = "studio.tokens.math.sin",
  COS = "studio.tokens.math.cos",
  TAN = "studio.tokens.math.tan",
  LERP = "studio.tokens.math.lerp",
  CLAMP = "studio.tokens.math.clamp",
  MOD = "studio.tokens.math.mod",
  RANDOM = "studio.tokens.math.random",
  COUNT = "studio.tokens.math.count",
  POW = "studio.tokens.math.pow",
  SQRT = "studio.tokens.math.sqrt",
  EXPONENT = "studio.tokens.math.exponent",
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

  // Gradient
  GRADIENT_STOP = "studio.tokens.gradient.stop",
  GRADIENT = "studio.tokens.gradient.gradient",
}

export type BatchRunError = Error & {
  nodeId: string
};


export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
//Alias for now, will be replaced with a proper type
export type Color = string

export type Curve = {
  curves: {
    type: "bezier" | "quadratic" | "cubic";
    points: [number, number][];
  }[];

}
export type Gradient = {
  type: "linear" | "radial" | "angular" | "diamond";
  positions: [number, number][];
  stops: GradientStop[];
};

export type GradientStop = {
  position: number;
  color: string;
};