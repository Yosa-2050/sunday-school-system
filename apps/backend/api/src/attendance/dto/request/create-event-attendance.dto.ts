import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAttendanceMemberDto } from './create-attendance-member.dto';
import { Type } from 'class-transformer';

export class CreateEventAttendanceDto {
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsString()
    startTime?: string;

    @ApiProperty()
    @IsString()
    endTime?: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;

    @ApiProperty({ type: [CreateAttendanceMemberDto]})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAttendanceMemberDto)
    members: CreateAttendanceMemberDto[];
}
