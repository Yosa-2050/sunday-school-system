import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { NotificationTemplate } from './entities/notificationTemplate.entity';
import { NotificationTemplatesSeedData } from './seeds/notificationTemplates.seed';

@Injectable()
export class NotificationTemplateSeedService {
    constructor(
        @InjectRepository(NotificationTemplate)
        private notificationTemplateRepo: Repository<NotificationTemplate>,
    ) {}

    async seedNotiificationTemplateData(): Promise<void> {
        try {
            const getAllTemplatesFromDb =
                await this.notificationTemplateRepo.find();
            const seedNotifTemplatesData = NotificationTemplatesSeedData;

            for (let i = 0; i < seedNotifTemplatesData.length; i++) {
                const notificationTemplate = seedNotifTemplatesData[i];
                const existingTemplate = getAllTemplatesFromDb.find(
                    (x) => x.templateName === notificationTemplate.templateName,
                );

                if (!existingTemplate) {
                    await this.notificationTemplateRepo.save(
                        notificationTemplate,
                    );
                }

                if (
                    existingTemplate &&
                    existingTemplate.content !== notificationTemplate.content
                ) {
                    await this.notificationTemplateRepo.update(
                        existingTemplate.id,
                        notificationTemplate,
                    );
                }
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
