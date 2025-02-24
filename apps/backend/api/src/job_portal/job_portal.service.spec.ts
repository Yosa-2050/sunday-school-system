import { Test, type TestingModule } from '@nestjs/testing';
import { JobPortalService } from './job_portal.service';

describe('JobPortalService', () => {
    let service: JobPortalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JobPortalService],
        }).compile();

        service = module.get<JobPortalService>(JobPortalService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
