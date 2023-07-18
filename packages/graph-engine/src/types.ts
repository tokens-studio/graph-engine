export type ExternalLoadOptions = { type: string; id: string; data: any };
export type ExternalLoader = (opts: ExternalLoadOptions) => Promise<any> | any;

export interface NodeDefinition<
  MappedInput = Record<string, any>,
  State = object,
  Output = any,
  Ephemeral = object,
  ExternalRequest = object
> {
  /**
   * Reverse domain name notation for the node
   */
  type: string;
  /**
   * Defaults of the state value. This is used to initialize the state of the node. State of the node is not persisted across executions,.
   */
  defaults?: undefined | Partial<State>;

  /**
   * An external function that causes a side effect to load ephemeral data. It is up to the node to expose the data to the user. Ephmeral data is not persisted across executions and will be requested to load each time. It is up to the user to cache the data if needed.
   * @param state
   * @returns
   */
  external?: (
    mappedInput: MappedInput,
    state: Partial<State>
  ) => ExternalRequest;
  /**
   * Takes in the names inputs of the source handles and coerces the final mapped Input state
   * @param input
   * @param state
   * @returns
   */
  mapInput?: (input: Record<string, any>, state: State) => MappedInput;
  /**
   * Validates the state
   * @param inputs
   * @throws Error if the inputs are invalid
   * @returns
   */
  validateInputs?: (input: MappedInput, state: State) => void;
  /**
   * Processes the value
   * @param input
   * @param state
   * @returns
   */
  process: (
    input: MappedInput,
    state: State,
    ephemeral: Ephemeral
  ) => Output | Promise<Output>;
  /**
   *  Maps the output to the final output
   * @param input
   * @param state
   * @param output
   * @returns
   */
  mapOutput?: (
    input: MappedInput,
    state: State,
    output: Output,
    ephemeral: Ephemeral
  ) => Record<string, any>;
}

export enum NodeTypes {
  INPUT = "studio.tokens.generic.input",
  OUTPUT = "studio.tokens.generic.output",

  ENUMERATED_INPUT = "studio.tokens.input.enumerated-constant",
  CONSTANT = "studio.tokens.input.constant",
  SLIDER = "studio.tokens.input.slider",
  SPREAD = "studio.tokens.input.extract",
  OBJECTIFY = "studio.tokens.input.objectify",
  JSON = "studio.tokens.input.json",

  CSS_MAP = "studio.tokens.css.map",

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
  JOIN = "studio.tokens.array.join",
  DOT_PROP = "studio.tokens.array.dotProp",

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

  // Color
  CONTRASTING = "studio.tokens.color.contrasting",
  SCALE = "studio.tokens.color.scale",
  CONVERT_COLOR = "studio.tokens.color.convert",
  BLEND = "studio.tokens.color.blend",
  ADVANCED_BLEND = "studio.tokens.color.blendAdv",
  CREATE_COLOR = "studio.tokens.color.create",
  EXTRACT = "studio.tokens.color.extract",
  TRANSFORM_COLOR = "studio.tokens.color.transform",
  WHEEL = "studio.tokens.color.wheel",

  //Sets
  FLATTEN = "studio.tokens.sets.flatten",
  ALIAS = "studio.tokens.sets.alias",
  REMAP = "studio.tokens.sets.remap",
  INLINE_SET = "studio.tokens.sets.inline",
  SET = "studio.tokens.sets.external",
  INVERT_SET = "studio.tokens.sets.invert",

  //Series
  ARITHMETIC_SERIES = "studio.tokens.sets.arithmetic",
  HARMONIC_SERIES = "studio.tokens.sets.harmonic",
  GEOMETRIC_SERIES = "studio.tokens.sets.geometric",

  //String
  UPPERCASE = "studio.tokens.string.uppercase",
  LOWER = "studio.tokens.string.lowercase",
  REGEX = "studio.tokens.string.regex",
  PASS_UNIT = "studio.tokens.typing.passUnit",
  PARSE_UNIT = "studio.tokens.typing.parseUnit",

  //Accessibility
  CONTRAST = "studio.tokens.accessibility.contrast",
  COLOR_BLINDNESS = "studio.tokens.accessibility.colorBlindness",
}
