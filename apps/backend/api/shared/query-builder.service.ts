import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm";
import { PER_PAGE, entityParamDeserializer } from "./schema";

@Injectable()
export class QueryBuilderService {
  async buildQuery<T>(
    repository: Repository<T>,
    queryString: string,
    joinOptions?: {
      relation: string;
      alias: string;
      condition?: string;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      parameters?: any;
    }[],
    searchableColumns?: string[]
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const params = entityParamDeserializer(queryString);
    const query = repository.createQueryBuilder("entity");

    // Apply joins
    if (joinOptions) {
      for (const join of joinOptions) {
        query.leftJoinAndSelect(
          join.relation,
          join.alias,
          join.condition,
          join.parameters
        );
      }
    }

    // Search across main table and joined tables
    if (params.s && searchableColumns?.length > 0) {
      const searchConditions = searchableColumns
        .map((column) => {
          // Check if the column is an expression (e.g., contains CONCAT)
          if (column.toUpperCase().includes("CONCAT")) {
            return `${column} ILIKE :search`;
          }
          // Handle regular column references
          if (column.includes(".")) {
            const [alias, field] = column.split(".");
            return `${alias}.${field} ILIKE :search`;
          }
          return `entity.${column} ILIKE :search`;
        })
        .join(" OR ");
      query.where(`(${searchConditions})`, { search: `%${params.s}%` });
    }

    // Apply filters (unchanged)
    if (params.f) {
      params.f.forEach((filter, index) => {
        const { f: field, v: value, o: operator = "eq" } = filter;
        const [alias, column] = field.includes(".")
          ? field.split(".")
          : ["entity", field];

        let parsedValue: boolean | string = value;
        if (value === "true" || value === "false") {
          parsedValue = value === "true";
        }

        const paramName = `param${index}`;
        switch (operator) {
          case "eq":
            query.andWhere(`${alias}.${column} = :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          // ... other operators unchanged ...
          default:
            break;
        }
      });
    }

    // Apply multi-column sorting (unchanged)
    if (params.o && params.o.length > 0) {
      for (const sort of params.o) {
        const { f: field, d: direction } = sort;
        const [alias, column] = field.includes(".")
          ? field.split(".")
          : ["entity", field];
        query.addOrderBy(
          `${alias}.${column}`,
          direction.toUpperCase() as "ASC" | "DESC"
        );
      }
    }

    // Apply pagination (unchanged)
    const page = params.p || 1;
    const perPage = params.pp || PER_PAGE;
    query.skip((page - 1) * perPage).take(perPage);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }
}
