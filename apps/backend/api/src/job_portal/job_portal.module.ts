import { Module } from '@nestjs/common';
import { JobPortalController } from './job_portal.controller';
import { JobPortalService } from './job_portal.service';

@Module({
    controllers: [JobPortalController],
    providers: [JobPortalService],
})
export class JobPortalModule {}
