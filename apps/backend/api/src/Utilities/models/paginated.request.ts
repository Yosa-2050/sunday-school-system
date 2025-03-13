import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
// biome-ignore lint/style/useImportType: <explanation>
import { StatusType } from '../enums/status-type.enum';

export class PaginationDto {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    status: StatusType;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    search: string;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value === 0 ? 1 : value))
    page?: number = 1;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Transform(({ value }) => (value === 0 ? 10 : value))
    limit?: number = 10;

    skip = (this.page - 1) * this.limit;
}
