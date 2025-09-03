import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
//import { DayOfTheWeeks } from "src/timetable/schedule/enums/day-of-the-week.enum";
import { PermissionType } from '../../enums/permission-type.enum';

export class CreatePermissionRequestDto {
    @ApiProperty()
    @IsEnum(PermissionType)
    type: PermissionType;

    // @ApiProperty()
    // @IsEnum(DayOfTheWeeks)
    // day: DayOfTheWeeks;

    @ApiProperty()
    @IsString()
    @IsUUID()
    studentId: string;
}
