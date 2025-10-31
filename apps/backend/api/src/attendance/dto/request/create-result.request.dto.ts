import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDefined,
    IsNumber,
    IsUUID,
    ValidateNested,
} from 'class-validator';

export class ResultRequestDto {
    @ApiProperty()
    @IsUUID()
    studentId: string;

    @ApiProperty()
    @IsNumber()
    score: number;
}

export class ResultForSingleStudentRequestDto extends ResultRequestDto {
    @ApiProperty()
    @IsUUID()
    testId: string;
}

export class ResultForMultipleStudentRequestDto extends ResultRequestDto {
    @ApiProperty()
    @IsUUID()
    testId: string;

    @IsDefined()
    @IsArray()
    @ValidateNested()
    @Type(() => ResultRequestDto)
    @ApiProperty({ type: [ResultRequestDto] })
    @ValidateNested({})
    result: ResultRequestDto[];
}
