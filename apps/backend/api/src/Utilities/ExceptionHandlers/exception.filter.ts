// biome-ignore lint/style/useImportType: <explanation>
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
// biome-ignore lint/style/useImportType: <explanation>
import { Request, Response } from 'express';
import { ApiResponseDto } from '../models/api-response.model';
import { EntityOperationNotAllowedException } from './Exceptions/notallowed.exception';
import { EntityNotFoundException } from './Exceptions/notfound.exception';
import { ErrorCodes } from './error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const isHttpException = exception instanceof HttpException;
        const status = isHttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = isHttpException
            ? exception.message
            : 'Internal server error';
        let errorCode = ErrorCodes.INTERNAL_ERROR;
        let errors: string[] = [];

        if (exception instanceof EntityNotFoundException) {
            errorCode = ErrorCodes.ENTITY_NOT_FOUND;
            errors = null;
        } else if (exception instanceof EntityOperationNotAllowedException) {
            errorCode = ErrorCodes.OPERATION_NOT_ALLOWED;
            errors = null;
        } else if (
            exception.name === 'ValidationError' ||
            status === HttpStatus.BAD_REQUEST
        ) {
            errorCode = ErrorCodes.VALIDATION_ERROR;
            errors = exception.response?.message;
        } else if (
            exception instanceof ForbiddenException ||
            exception instanceof UnauthorizedException
        ) {
            errorCode = null;
            errors = null;
        } else {
            this.logger.error(exception);
            //console.log(exception);
        }

        const apiResDto = new ApiResponseDto<string>(
            status,
            message,
            null,
            errorCode,
            ErrorCodes[errorCode],
            errors,
        );
        response.status(status).json(
            instanceToPlain(apiResDto, {
                exposeUnsetFields: false,
            }),
        );
    }
}
