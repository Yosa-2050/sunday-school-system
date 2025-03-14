import { createZodDto } from "nestjs-zod";
import qs from "qs";
import { z } from "zod";

export const PER_PAGE = 15;

export const entityParamSchema = z.object({
  s: z.string().optional(),
  f: z
    .array(
      z.object({
        f: z.string(),
        v: z.string(),
        o: z
          .enum([
            "eq",
            "neq",
            "gt",
            "gte",
            "lt",
            "lte",
            "like",
            "ilike",
            "is",
            "is_not",
          ])
          .optional(),
      })
    )
    .optional(), // filter
  o: z
    .array(
      z.object({
        f: z.string(),
        d: z.enum(["asc", "desc"]),
      })
    )
    .optional(), // order
  p: z.number().optional(), // page
  pp: z.number().optional(), // perPage
});
export type EntityParam = z.infer<typeof entityParamSchema>;
export class EntityParamDto extends createZodDto(entityParamSchema) {}

export const entityParamSerializer = (param?: EntityParam | null): string => {
  return qs.stringify(param, { skipNulls: true });
};
export const entityParamDeserializer = (queryString: string): EntityParam => {
  return qs.parse(queryString);
};
