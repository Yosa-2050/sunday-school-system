import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanStatus } from '../enum/plan-status-enum';
import { CreatePlanActivityDto } from './create-plan-activity.dto';


export class CreatePlanDto {
  @ApiProperty()
  @IsUUID()
  departmentId: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PlanStatus)
  status?: PlanStatus = PlanStatus.DRAFT;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanActivityDto)
  activities: CreatePlanActivityDto[];
}
