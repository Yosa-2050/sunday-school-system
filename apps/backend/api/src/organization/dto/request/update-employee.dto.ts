import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-organization-member.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
