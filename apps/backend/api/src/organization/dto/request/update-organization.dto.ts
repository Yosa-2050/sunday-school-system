import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { CompanySize } from '@shega/organization/enums/company-size.enum';
import { CompanyType } from '@shega/organization/enums/company-type.enum';
import { OptionalEnum, OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}

export class UpdateOrganizationInfoDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
        registrationNumber: string;
    
        @ApiProperty()
    @IsString()
    @IsOptional()
        description: string;
    
        @ApiProperty()
    @IsString()
    @IsOptional()
        displayName: string;
    
        @ApiProperty()
        @OptionalEnum(CompanyType)
        type: CompanyType;
    
        @ApiProperty()
        @OptionalUUID()
        sectorId: string;
    
        @ApiProperty()
    @IsNumber()
    @IsOptional()
        yearFounded: number;
    
        @ApiProperty()
        @OptionalEnum(CompanySize)
        companySize: CompanySize;
}

