import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@shega/users/users.module';
import { ClassController } from './controllers/classes.controller';
import { LmsController } from './controllers/lms.controller';
import { StudentController } from './controllers/student.controller';
import { CalendarYear } from './entities/calendar-year.entity';
import { Classes } from './entities/classes.entity';
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
        ]),
        UsersModule,
    ],
    controllers: [LmsController, ClassController, StudentController],
    providers: [LmsService, ClassService, StudentService],
})
export class LmsModule {}
