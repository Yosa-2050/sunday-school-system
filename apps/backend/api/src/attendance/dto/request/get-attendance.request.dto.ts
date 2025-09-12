import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class GetAttendanceRequestDto {
    @ApiProperty()
    @IsUUID()
    classId: string;

    @ApiProperty()
    @OptionalUUID()
    attendanceInfoId: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    endDate?: Date;
}

export class GetAttendanceDetailRequestDto {
    @ApiProperty()
    @OptionalUUID()
    classId: string;

    @ApiProperty()
    @OptionalUUID()
    subjectId: string;
}
