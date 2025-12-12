import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsUUID } from 'class-validator';

export class DepartmentMembersDto {
    @ApiProperty({ description: 'Filter by department ID' })
    @IsUUID()
    departmentId: string;

    @ApiPropertyOptional({ description: 'Filter by sub-department ID' })
    @OptionalUUID()
    subDepartmentId?: string;
}
