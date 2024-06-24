declare module 'json-schema-defaults' {
	const jsonSchemaDefaults: (schema: any) => any;
	export default jsonSchemaDefaults;
}

declare module '*.json' {
	const value: any;
	export default value;
}
