import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDefined,
    IsEnum,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { LocationModel } from '../model/location.model';

export class CreateLocationRequestDto {
    @ApiProperty()
    @IsString()
    reference: string;

    @ApiProperty()
    @IsEnum(ReferenceType)
    referenceType: ReferenceType;

    @IsDefined()
    @Type(() => LocationModel)
    @ApiProperty({ type: LocationModel })
    @ValidateNested({})
    location: LocationModel;

    @ApiProperty()
    @IsBoolean()
    isPreferred: boolean;
}
