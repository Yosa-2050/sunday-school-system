import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTemplateSeedService } from './notification-template-seed.service';

describe('NotificationTemplateSeedService', () => {
  let service: NotificationTemplateSeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationTemplateSeedService],
    }).compile();

    service = module.get<NotificationTemplateSeedService>(NotificationTemplateSeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
