export type PortDefinition = {
    id: string,
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema?: any,
    required?: boolean,
    addressable?: boolean,
    description?: string,
    values?: string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default?: any
}
