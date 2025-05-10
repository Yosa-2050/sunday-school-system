import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ApiResponseDto<T> {
    @ApiProperty()
    @Expose()
    statusCode: number;

    @ApiProperty()
    @Expose()
    success: boolean;

    @ApiProperty()
    @Expose()
    message: string;

    @ApiProperty({ required: false })
    @Expose()
    data?: T;

    @ApiProperty({ required: false })
    @Expose()
    errorCode?: number;

    @ApiProperty({ required: false })
    @Expose()
    errorType?: string;

    @ApiProperty({ required: false })
    @Expose()
    errors?: string[];

    constructor(
        statusCode: number,
        message?: string,
        data?: T,
        errorCode?: number,
        errorType?: string,
        errors?: string[],
    ) {
        this.statusCode = statusCode;
        this.success = !(statusCode >= 200 || statusCode < 300);
        this.message = message ?? (this.success ? 'Success' : 'Failed');
        this.data = data ?? undefined;
        this.errors = errors ?? undefined;
        this.errorCode = errorCode ?? undefined;
        this.errorType = errorType ?? undefined;
    }
}
