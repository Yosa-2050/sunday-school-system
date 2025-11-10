import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from '@shega/lms/entities/students.entity';
import { SubjectAssignment } from '@shega/lms/entities/subject-assignment.entity';
import { LmsModule } from '@shega/lms/lms.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceInformation } from './entities/attendance-data.entity';
import { Attendance } from './entities/attendance.entity';
import { Permission } from './entities/permission.entity';
import { Result } from './entities/result.entity';
import { Test } from './entities/test.entity';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Attendance,
            AttendanceInformation,
            Permission,
            Test,
            SubjectAssignment,
            Result,
            Students,
        ]),
        LmsModule,
        UsersModule,
        NotificationModule,
    ],
    controllers: [AttendanceController, TestController, ResultController],
    providers: [AttendanceService, TestService, ResultService],
    //exports: [LmsService],
})
export class AttendanceModule {}
