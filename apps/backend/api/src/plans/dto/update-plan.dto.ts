import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-plan.dto';
import { PlanStatus } from '../enum/plan-status-enum';
import { IsEnum } from 'class-validator';
 
export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
 
export class UpdatePlanStatusDto {
  @ApiProperty()
  @IsEnum(PlanStatus)
  status: PlanStatus;
}
