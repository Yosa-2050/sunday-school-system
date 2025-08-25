import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { NewProfileDto } from '@shega/users/dto/new-profile.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreateStudentRequestDto extends NewProfileDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    idNumber?: string;

    @ApiProperty()
    @OptionalUUID()
    classId: string;
}
