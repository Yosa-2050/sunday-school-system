import { PartialType } from '@nestjs/swagger';
import { CreateMentorShipProgramRequestDto } from './create-mentorship.request.dto';

export class UpdateMentorShipProgramDto extends PartialType(
    CreateMentorShipProgramRequestDto,
) {}
