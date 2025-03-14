import qs from 'qs';
import { z } from 'zod';

export const PER_PAGE = 10;

export const entityParamSchema = z.object({
    s: z.string().optional(),
    f: z
        .array(
            z.object({
                f: z.string(),
                v: z.string(),
                o: z
                    .enum([
                        'eq',
                        'neq',
                        'gt',
                        'gte',
                        'lt',
                        'lte',
                        'like',
                        'ilike',
                        'is',
                        'is_not',
                    ])
                    .optional(),
            }),
        )
        .optional(),
    o: z
        .array(
            z.object({
                f: z.string(),
                d: z.enum(['asc', 'desc']),
            }),
        )
        .optional(),
    p: z.number().optional(),
    pp: z.number().optional(),
});

export type EntityParam = z.infer<typeof entityParamSchema>;

export const entityParamSerializer = (param?: EntityParam | null): string => {
    return qs.stringify(param, { skipNulls: true });
};
export const entityParamDeserializer = (queryString: string): EntityParam => {
    return qs.parse(queryString);
};
