import { Test, TestingModule } from '@nestjs/testing';
import { AdminReportService } from './admin-report.service';

describe('AdminReportService', () => {
  let service: AdminReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminReportService],
    }).compile();

    service = module.get<AdminReportService>(AdminReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
