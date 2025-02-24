import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Extract entity and column information from the exception
    const entity = exception.message.split('"')[1];
    const column = exception.message.split('"')[3];

    response.status(500).json({
      statusCode: 500,
      message: `Error: Duplicate key violation in entity '${entity}' on column '${column}'`,
    });
  }
}
