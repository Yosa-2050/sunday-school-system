import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@shega/notification/notification.module';
import { OrganizationModule } from '@shega/organization/organization.module';
import { UsersModule } from '@shega/users/users.module';
import { ClassController } from './controllers/classes.controller';
import { HomeRoomController } from './controllers/home-room.controller';
import { LmsController } from './controllers/lms.controller';
import { StudentController } from './controllers/student.controller';
import { SubjectController } from './controllers/subject.controller';
import { TeacherController } from './controllers/teacher.controller';
import { CalendarYear } from './entities/calendar-year.entity';
import { Classes } from './entities/classes.entity';
import { HomeroomAssignment } from './entities/home-room.entity';
import { ProgramUser } from './entities/program-users.entity';
import { Program } from './entities/program.entity';
import { RootClass } from './entities/root-class.entity';
import { Students } from './entities/students.entity';
import { SubjectAssignment } from './entities/subject-assignment.entity';
import { Subjects } from './entities/subject.entity';
import { TeacherAssignment } from './entities/teacher-assignment.entity';
import { Teacher } from './entities/teacher.entity';
import { ClassService } from './services/class.service';
import { HomeRoomService } from './services/home-room.service';
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
            HomeroomAssignment,
        ]),
        UsersModule,
        NotificationModule,
        OrganizationModule,
    ],
    controllers: [
        LmsController,
        ClassController,
        StudentController,
        SubjectController,
        TeacherController,
        HomeRoomController,
    ],
    providers: [
        LmsService,
        ClassService,
        StudentService,
        TeacherService,
        SubjectService,
        HomeRoomService,
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
