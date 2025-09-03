import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LmsModule } from '@shega/lms/lms.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceInformation } from './entities/attendance-data.entity';
import { Attendance } from './entities/attendance.entity';
import { Permission } from './entities/permission.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Attendance,
            AttendanceInformation,
            Permission,
        ]),
        LmsModule,
        UsersModule,
        NotificationModule,
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    //exports: [LmsService],
})
export class AttendanceModule {}
