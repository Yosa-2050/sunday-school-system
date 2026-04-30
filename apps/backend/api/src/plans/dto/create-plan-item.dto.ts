import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanItemDto {
  @ApiProperty()
  @IsString()
  itemNumber: string;
 
  @ApiProperty()
  @IsString()
  activityName: string;
 
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;
 
  @ApiProperty()
  @IsNumber()
  quantity: number;
 
  @ApiProperty()
  @IsNumber()
  budget: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(12)
  @ArrayMaxSize(12)
  @IsBoolean({ each: true })
  months: boolean[];
}
