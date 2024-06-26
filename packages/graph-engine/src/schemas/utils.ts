export const extractArray = (schema: Record<string, unknown>) => {
	if (schema.type === 'array') {
		return schema.items;
	}
	return schema;
};

export const arrayOf = (schema: Record<string, unknown>) => {
	return {
		type: 'array',
		items: schema
	};
};
