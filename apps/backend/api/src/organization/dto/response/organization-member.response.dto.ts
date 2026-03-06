import { ApiProperty } from '@nestjs/swagger';
import type { OrganizationMembers } from '../../entities/organization-member.entity';
import type { OrganizationMemberType } from '../../enums/employee-type.enum';

export class OrganizationMemberResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    id_number: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    middleName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    type: OrganizationMemberType;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    static fromEntity(
        item: OrganizationMembers,
    ): OrganizationMemberResponseDto {
        const dto = new OrganizationMemberResponseDto();
        dto.id = item.id;
        dto.id_number = item.id_number;
        dto.firstName = item.profile.firstName;
        dto.middleName = item.profile.middleName;
        dto.lastName = item.profile.lastName;
        dto.email = item.profile.user?.email || '';
        dto.type = item.type;
        dto.isActive = item.isActive;
        dto.createdAt = item.createdAt;
        return dto;
    }
}

import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';

export class PaginatedOrganizationMemberResponseDto extends PaginatedResponseDto<
    OrganizationMemberResponseDto[]
> {}
