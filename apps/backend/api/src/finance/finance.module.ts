import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { ReportItem } from './entity/report-item.entity';
import { Report } from './entity/report.entity';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Report, ReportItem]),
        UsersModule,
        NotificationModule,
    ],
    providers: [FinanceService],
    controllers: [FinanceController],
})
export class FinanceModule {}
