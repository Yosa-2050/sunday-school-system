import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { ClassController } from './controllers/classes.controller';
import { LmsController } from './controllers/lms.controller';
import { StudentController } from './controllers/student.controller';
import { CalendarYear } from './entities/calendar-year.entity';
import { Classes } from './entities/classes.entity';
import { ProgramUser } from './entities/program-users.entity';
import { Program } from './entities/program.entity';
import { RootClass } from './entities/root-class.entity';
import { Students } from './entities/students.entity';
import { ClassService } from './services/class.service';
import { LmsService } from './services/lms.service';
import { StudentService } from './services/student.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Classes,
            Students,
            Program,
            RootClass,
            CalendarYear,
            ProgramUser,
        ]),
        UsersModule,
        NotificationModule,
    ],
    controllers: [LmsController, ClassController, StudentController],
    providers: [LmsService, ClassService, StudentService],
    exports: [LmsService],
})
export class LmsModule {}
