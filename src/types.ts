export type NodeDefinition<MappedInput extends Record<string, any> = Record<string, any>, State = object, Output = any> = {
    /**
     * Reverse domain name notation for the node
     */
    type: string,
    /**
     * Defaults of the state value
     */
    defaults?: undefined | Partial<State>,
    /**
     * Takes in the names inputs of the source handles and coerces the final mapped Input state
     * @param input 
     * @param state 
     * @returns 
     */
    mapInput?: (input: Record<string, any>, state: State) => MappedInput,
    /**
     * Validates the state 
     * @param inputs 
     * @throws Error if the inputs are invalid
     * @returns 
     */
    validateInputs?: (input: MappedInput, state: State) => void,
    /**
     * Processes the value
     * @param input 
     * @param state 
     * @returns 
     */
    process: (input: MappedInput, state: State) => Output | Promise<Output>,
    /**
     *  Maps the output to the final output
     * @param input 
     * @param state 
     * @param output 
     * @returns 
     */
    mapOutput?: (input: MappedInput, state: State, output: Output) => Record<string, any>

}

export enum NodeTypes {
    INPUT = 'studio.tokens.generic.input',
    OUTPUT = 'studio.tokens.generic.output',


    ENUMERATED_INPUT = 'studio.tokens.input.enumerated-constant',
    CONSTANT = 'studio.tokens.input.constant',
    SLIDER = 'studio.tokens.input.slider',


    CSS_MAP = 'studio.tokens.css.map',

    //Logic
    IF = 'studio.tokens.logic.if',
    NOT = 'studio.tokens.logic.not',
    AND = 'studio.tokens.logic.and',
    OR = 'studio.tokens.logic.or',
    SWITCH = 'studio.tokens.logic.switch',
    COMPARE = 'studio.tokens.logic.compare',

    //Array
    ARRAY_INDEX = 'studio.tokens.array.index',
    ARRIFY = 'studio.tokens.array.arrify',


    // Math
    ADD = 'studio.tokens.math.add',
    SUBTRACT = 'studio.tokens.math.subtract',
    MULTIPLY = 'studio.tokens.math.multiply',
    DIV = 'studio.tokens.math.divide',
    ABS = 'studio.tokens.math.abs',
    ROUND = 'studio.tokens.math.round',
    SIN = 'studio.tokens.math.sin',
    COS = 'studio.tokens.math.cos',
    TAN = 'studio.tokens.math.tan',
    LERP = 'studio.tokens.math.lerp',
    CLAMP = 'studio.tokens.math.clamp',
    RANDOM = 'studio.tokens.math.random',
    COUNT = 'studio.tokens.math.count',


    // Color
    SCALE = 'studio.tokens.color.scale',
    BLEND = 'studio.tokens.color.blend',
    CREATE_COLOR = 'studio.tokens.color.create',

    //Sets 
    FLATTEN = 'studio.tokens.sets.flatten',
    ALIAS = 'studio.tokens.sets.alias',
    REMAP = 'studio.tokens.sets.remap',
    INLINE_SET = 'studio.tokens.sets.inline',
    SET = 'studio.tokens.sets.external',

    //Series 
    ARITHMETIC_SERIES = 'studio.tokens.sets.arithmetic',
    HARMONIC_SERIES = 'studio.tokens.sets.harmonic',

    //String
    UPPERCASE = 'studio.tokens.string.uppercase',
    LOWER = 'studio.tokens.string.lowercase',
    REGEX = 'studio.tokens.string.regex',
    PASS_UNIT = 'studio.tokens.typing.passUnit',
    //Accessibility
    CONTRAST = 'studio.tokens.accessibility.contrast',
}