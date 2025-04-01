import { ApiProperty } from "@nestjs/swagger";
import { EmploymentType } from "@shega/job_portal/enums/employment-type.enum";
import { WorkPlaceType } from "@shega/job_portal/enums/work-place-type.enum";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class AddExperianceRequestDto {
    @ApiProperty()
    @IsString()
        title: string;
    
        @ApiProperty()
    @IsString()
        company: string;
    
        @ApiProperty()
        startDate: Date;
    
        @ApiProperty()
        endDate: Date;

        @ApiProperty()
        @IsEnum(EmploymentType)
        type: EmploymentType;
    
        @ApiProperty()
            @IsString()
            @IsUUID()
            @IsOptional()
                @Transform(({ value }) => (value === '' ? undefined : value))
        countryId: string;
    
        @ApiProperty()
            @IsString()
            @IsUUID()
            @IsOptional()
                @Transform(({ value }) => (value === '' ? undefined : value))
        stateId: string;
    
        @ApiProperty()
            @IsString()
            @IsUUID()
            @IsOptional()
                @Transform(({ value }) => (value === '' ? undefined : value))
        cityId: string;
    
        @ApiProperty()
        @IsEnum(WorkPlaceType)
        workPlace: WorkPlaceType;
}
