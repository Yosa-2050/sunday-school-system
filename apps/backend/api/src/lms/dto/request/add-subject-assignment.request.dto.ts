import { ApiProperty } from '@nestjs/swagger';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { TeacherType } from '@shega/lms/enums/teacher-type.enums';
import { IsOptional, IsString } from 'class-validator';
export class AddSubjectAssignmentDto {
    @ApiProperty()
    @IsString()
    subjectId: string;

    @ApiProperty()
    @IsString()
    classId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
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
