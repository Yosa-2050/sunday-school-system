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
          // Check if the column belongs to a joined table
          if (column.includes(".")) {
            const [alias, field] = column.split(".");
            return `${alias}.${field} ILIKE :search`;
            // biome-ignore lint/style/noUselessElse: <explanation>
          } else {
            return `entity.${column} ILIKE :search`;
          }
        })
        .join(" OR ");
      query.where(`(${searchConditions})`, { search: `%${params.s}%` });
    }

    // Apply filters
    if (params.f) {
      params.f.forEach((filter, index) => {
        const { f: field, v: value, o: operator = "eq" } = filter;

        // Check if the field belongs to a joined table
        const [alias, column] = field.includes(".")
          ? field.split(".")
          : ["entity", field];

        // Parse boolean values
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let parsedValue: any = value;
        if (value === "true" || value === "false") {
          parsedValue = value === "true"; // Convert string to boolean
        }

        // Generate a unique parameter name for each condition
        const paramName = `param${index}`;

        switch (operator) {
          case "eq":
            query.andWhere(`${alias}.${column} = :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          case "neq":
            query.andWhere(`${alias}.${column} != :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          case "gt":
            query.andWhere(`${alias}.${column} > :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          case "gte":
            query.andWhere(`${alias}.${column} >= :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          case "lt":
            query.andWhere(`${alias}.${column} < :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          case "lte":
            query.andWhere(`${alias}.${column} <= :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          case "like":
            query.andWhere(`${alias}.${column} LIKE :${paramName}`, {
              [paramName]: `%${parsedValue}%`,
            });
            break;
          case "ilike":
            query.andWhere(`${alias}.${column} ILIKE :${paramName}`, {
              [paramName]: `%${parsedValue}%`,
            });
            break;
          case "is":
            query.andWhere(`${alias}.${column} IS :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          case "is_not":
            query.andWhere(`${alias}.${column} IS NOT :${paramName}`, {
              [paramName]: parsedValue,
            });
            break;
          default:
            break;
        }
      });
    }

    // Apply multi-column sorting
    if (params.o && params.o.length > 0) {
      for (const sort of params.o) {
        const { f: field, d: direction } = sort;

        // Check if the field belongs to a joined table
        const [alias, column] = field.includes(".")
          ? field.split(".")
          : ["entity", field];

        query.addOrderBy(
          `${alias}.${column}`,
          direction.toUpperCase() as "ASC" | "DESC"
        );
      }
    }

    // Apply pagination
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
