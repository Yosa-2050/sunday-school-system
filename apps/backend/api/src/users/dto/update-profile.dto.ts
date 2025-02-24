import { PartialType } from '@nestjs/swagger';
import { NewProfileDto } from './new-profile.dto';

export class UpdateProfileDto extends PartialType(NewProfileDto) {}
