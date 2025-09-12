import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@shega/notification/notification.module';
import { UsersModule } from '@shega/users/users.module';
import { ClassController } from './controllers/classes.controller';
import { LmsController } from './controllers/lms.controller';
import { StudentController } from './controllers/student.controller';
import { SubjectController } from './controllers/subject.controller';
import { CalendarYear } from './entities/calendar-year.entity';
import { Classes } from './entities/classes.entity';
import { ProgramUser } from './entities/program-users.entity';
import { Program } from './entities/program.entity';
import { RootClass } from './entities/root-class.entity';
import { Students } from './entities/students.entity';
import { SubjectAssignment } from './entities/subject-assignment.entity';
import { Subjects } from './entities/subject.entity';
import { TeacherAssignment } from './entities/teacher-assignment.entity';
import { Teacher } from './entities/teacher.entity';
import { ClassService } from './services/class.service';
import { LmsService } from './services/lms.service';
import { StudentService } from './services/student.service';
import { SubjectService } from './services/subject.service';
import { TeacherService } from './services/teacher.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Classes,
            Students,
            Program,
            RootClass,
            CalendarYear,
            ProgramUser,
            Teacher,
            SubjectAssignment,
            TeacherAssignment,
            Subjects,
        ]),
        UsersModule,
        NotificationModule,
    ],
    controllers: [
        LmsController,
        ClassController,
        StudentController,
        SubjectController,
    ],
    providers: [
        LmsService,
        ClassService,
        StudentService,
        TeacherService,
        SubjectService,
    ],
    exports: [
        LmsService,
        StudentService,
        ClassService,
        TeacherService,
        SubjectService,
    ],
})
export class LmsModule {}
