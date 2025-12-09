import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsString } from 'class-validator';

export class AddDepartmentRequestDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @OptionalUUID()
    parentId?: string;
}
