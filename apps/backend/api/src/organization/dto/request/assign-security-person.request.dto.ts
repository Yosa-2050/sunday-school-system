import { ApiProperty } from '@nestjs/swagger';
import { EmployeeType } from '@shega/organization/enums/employee-type.enum';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class AssignEmployeeRequestDto {
    @ApiProperty()
    @IsString()
    @IsUUID()
    organizationId: string;

    @ApiProperty()
    @IsString()
    @IsUUID()
    employeeId: string;

    @ApiProperty()
    @IsString()
    branchId: string;

    @ApiProperty()
    @IsEnum(EmployeeType)
    type: EmployeeType;
}
