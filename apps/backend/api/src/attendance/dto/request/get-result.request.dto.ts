import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsUUID } from 'class-validator';

export class GetResultRequestDto {
    @ApiProperty()
    @IsUUID()
    classId: string;

    @ApiProperty()
    @OptionalUUID()
    subjectId: string;

    @ApiProperty()
    @OptionalUUID()
    testId: string;
}
