import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class AssignMemberDto {
    @ApiProperty()
    @IsUUID()
    @IsString()
    departmentId: string;

    @ApiProperty()
    @IsUUID()
    @IsString()
    @IsOptional()
    subDepartmentId: string;

    @ApiProperty()
    @IsUUID()
    @IsString()
    memberId: string;

    @ApiProperty()
    @IsString()
    // @IsEnum()
    position?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    startDate?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    endDate?: string;
}
