// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import * as fs from 'fs';
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { LookUps } from '../entities/lookups.entity';

@Injectable()
export class LookupService {
    private readonly logger = new Logger(LookupService.name);
    private readonly seedFlagFile = path.resolve(__dirname, 'lookups');

    constructor(
        @InjectRepository(LookUps)
        private readonly lookUpsRepo: Repository<LookUps>,
    ) {}

    async seedFromCsvIfNeeded() {
        const filePath = path.resolve(__dirname, '../../data/lookups.csv');

        const fileContent = fs.readFileSync(filePath);

        const allLookUps = await this.lookUpsRepo.find();

        parse(
            fileContent,
            { columns: true, trim: true, delimiter: ';' },
            async (err, records: LookUps[]) => {
                if (err) {
                    this.logger.error('CSV parse error', err);
                    return;
                }

                for (const raw of records) {
                    const record = this.lookUpsRepo.create(raw);
                    const existing = allLookUps.find(
                        (x) =>
                            x.code === record.code && x.group === record.group,
                    );

                    if (existing) {
                        await this.lookUpsRepo.update(existing.id, record);
                    } else {
                        await this.lookUpsRepo.insert(record);
                    }
                }

                // Create flag file
                //fs.writeFileSync(this.seedFlagFile, 'seeded');

                this.logger.log('LookUps seeded successfully.');
            },
        );
    }

    findByGroup(group: string, subGroup = '') {
        if (subGroup) {
            return this.lookUpsRepo.findBy({ group, subGroup });
        }
        return this.lookUpsRepo.findBy({ group });
    }

    findByCode(code: string) {
        return this.lookUpsRepo.findOneByOrFail({ code });
    }

    findById(id: string) {
        return this.lookUpsRepo.findOneByOrFail({ id });
    }
}
