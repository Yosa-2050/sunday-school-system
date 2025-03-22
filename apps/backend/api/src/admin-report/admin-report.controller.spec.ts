import { Test, TestingModule } from '@nestjs/testing';
import { AdminReportController } from './admin-report.controller';

describe('AdminReportController', () => {
  let controller: AdminReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminReportController],
    }).compile();

    controller = module.get<AdminReportController>(AdminReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
