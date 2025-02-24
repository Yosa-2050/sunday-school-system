import { Test, type TestingModule } from '@nestjs/testing';
import { JobPortalController } from './job_portal.controller';
import { JobPortalService } from './job_portal.service';

describe('JobPortalController', () => {
    let controller: JobPortalController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobPortalController],
            providers: [JobPortalService],
        }).compile();

        controller = module.get<JobPortalController>(JobPortalController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
