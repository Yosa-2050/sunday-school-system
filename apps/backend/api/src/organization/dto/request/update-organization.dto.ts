import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    OptionalEnum,
    OptionalUUID,
} from '@shega/Utilities/decorators/optional-uuid.decorator';
import { CompanySize } from '@shega/organization/enums/company-size.enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateOrganizationDto } from './create-organization.dto';
import { OrganizationType } from '@shega/organization/enums/organization-type.enum';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}

export class UpdateOrganizationInfoDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    registrationNumber: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    corporateEmail: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    displayName: string;

    @ApiProperty()
    @OptionalEnum(OrganizationType)
    type: OrganizationType;

    @ApiProperty()
    @OptionalUUID()
    industryId: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    yearFounded: number;

    @ApiProperty()
    @OptionalEnum(CompanySize)
    companySize: CompanySize;
}
