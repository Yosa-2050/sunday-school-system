import { ApiProperty } from '@nestjs/swagger';
import { TeacherType } from '@shega/lms/enums/teacher-type.enums';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class HomeRoomAssignmentDto {
    @ApiProperty()
    @IsString()
    @IsUUID()
    classId: string;

    @ApiProperty()
    @IsString()
    @IsUUID()
    memberId: string;

    @ApiProperty()
    @IsEnum(TeacherType)
    type: TeacherType;
}
