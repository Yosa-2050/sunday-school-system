import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { EmployeeType } from "src/organization/enums/employee-type.enum";

export class AssignEmployeeRequestDto{
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