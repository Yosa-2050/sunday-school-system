import { Test, type TestingModule } from '@nestjs/testing';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './organization.service';

describe('OrganizationController', () => {
    let controller: OrganizationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrganizationController],
            providers: [OrganizationService],
        }).compile();

        controller = module.get<OrganizationController>(OrganizationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
