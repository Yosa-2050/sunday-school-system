import { ApiProperty } from "@nestjs/swagger";
import { LocationModel } from "../model/location.model";
import { IsBoolean, IsDefined, IsEnum, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ReferenceType } from "src/Utilities/enums/reference-type.enum";

export class CreateLocationRequestDto{

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