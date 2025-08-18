import { PartialType } from '@nestjs/swagger';
import { CreateLmDto } from './create-lm.dto';

export class UpdateLmDto extends PartialType(CreateLmDto) {}
