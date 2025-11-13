import { ApiProperty } from '@nestjs/swagger';
import { OrganizationMemberType } from '@shega/organization/enums/employee-type.enum';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class AssignMembersToOrganizationRequestDto {
    @ApiProperty()
    @IsString()
    @IsUUID()
    organizationId: string;

    @ApiProperty()
    @IsString()
    @IsUUID()
    profileId: string;

    @ApiProperty()
    @IsString()
    branchId: string;

    @ApiProperty()
    @IsEnum(OrganizationMemberType)
    type: OrganizationMemberType;
}
