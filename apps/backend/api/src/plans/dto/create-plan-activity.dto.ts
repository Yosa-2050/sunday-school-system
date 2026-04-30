import { IsArray, IsString, ValidateNested } from "class-validator";
import { CreatePlanItemDto } from "./create-plan-item.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePlanActivityDto {

  @ApiProperty()
  @IsString()
  activityNumber: string;
 
  @ApiProperty()
  @IsString()
  name: string;
 
  @ApiProperty()
  @IsArray()
  @Type(() => CreatePlanItemDto)
  items: CreatePlanItemDto[];
}
