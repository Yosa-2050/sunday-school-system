import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { YesOrNoOptions } from '@shega/Utilities/enums/yes-or-no-options.enums';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class JobApplicationRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    coverLetter: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    noticePeriod: number;

    @ApiProperty()
    @OptionalEnum(YesOrNoOptions)
    relocationOption: YesOrNoOptions;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    experience: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    salaryExpectation: number;
}
