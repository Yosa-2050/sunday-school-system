import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { DepartmentMemberPosition } from '@shega/lms/enums/department-member-position-type.enums';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignMemberDto {
    @ApiProperty()
    @IsUUID()
    @IsString()
    departmentId: string;

    @ApiProperty()
    @OptionalUUID()
    subDepartmentId: string;

    @ApiProperty()
    @IsUUID()
    @IsString()
    memberId: string;

    @ApiProperty()
    @IsString()
    @IsEnum(DepartmentMemberPosition)
    position: DepartmentMemberPosition;

    @ApiProperty()
    @IsString()
    @IsOptional()
    startDate?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    endDate?: string;
}
