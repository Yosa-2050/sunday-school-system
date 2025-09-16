import { ApiProperty } from '@nestjs/swagger';
import {
    OptionalEnum,
    OptionalUUID,
} from '@shega/Utilities/decorators/optional-uuid.decorator';
import { TeacherType } from '@shega/lms/enums/teacher-type.enums';
import { IsOptional, IsString, IsUUID } from 'class-validator';
export class AddSubjectAssignmentDto {
    @ApiProperty()
    @IsString()
    @IsUUID()
    subjectId: string;

    @ApiProperty()
    @IsString()
    @IsUUID()
    classId: string;

    @ApiProperty()
    @OptionalUUID()
    teacherId: string;

    @ApiProperty()
    @IsString()
    subjectTitle: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @OptionalEnum(TeacherType)
    teacherType: TeacherType;
}
