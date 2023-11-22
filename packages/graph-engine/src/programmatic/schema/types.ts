
import { z } from 'zod';

export type Schema<T extends z.ZodTypeAny = z.ZodTypeAny> = {
    name: string;
    validator: T;
}


export function schema<T extends z.ZodTypeAny>(...args: any[]): Schema<T> {
    if (arguments.length > 1) {
        const [name, schema] = args;

        return {
            name,
            validator: schema
        };
    } else {
        const [schema] = args;

        return {
            name: schema.constructor.name.replace('Zod', ''),
            validator: schema
        };
    }
}
