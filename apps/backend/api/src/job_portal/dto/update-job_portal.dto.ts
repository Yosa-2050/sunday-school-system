import { PartialType } from '@nestjs/swagger';
import { CreateJobPortalDto } from './create-job_portal.dto';

export class UpdateJobPortalDto extends PartialType(CreateJobPortalDto) {}
