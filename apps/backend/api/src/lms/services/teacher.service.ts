import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { TeacherResponseDto } from '@shega/education/dto/response/teacher.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from '@shega/organization/dto/request/create-employee.dto';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { Classes } from '../entities/classes.entity';
import { Teacher } from '../entities/teacher.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from './class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LmsService } from './lms.service';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Classes) private classRepo: Repository<Classes>,
        @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
        private classService: ClassService,
        private profileService: ProfileService,
        private lmsService: LmsService,
    ) {}

    async CreateTeacher(dto: CreateEmployeeDto, yearId: string) {
        const cYear = await this.lmsService.calendarYearById(yearId);

        const profile = await this.profileService.createNewUserProfileQDE(
            dto.email,
            LoginBy.EMAIL,
            UserRoleType.Teacher,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            dto.phoneNumber,
            dto.gender,
            dto.birthDate,
            dto.baptistName,
            false,
            dto.password,
            true,
        );

        const model = this.teacherRepo.create();
        model.profile = profile;
        model.year = cYear;
        const saved = await this.teacherRepo.save(model);
        return saved;
    }

    async addExistingTeacher(profileId: string, yearId: string) {
        const cYear = await this.lmsService.calendarYearById(yearId);
        const profile = await this.profileService.findByIdOrThrow(profileId);

        const teacher = await this.teacherRepo.findOneBy({
            profile: { id: profileId },
        });
        if (teacher) {
            throw new EntityAlreadyExistsException('Profile');
        }

        const model = this.teacherRepo.create();
        model.profile = profile;
        model.year = cYear;
        const saved = await this.teacherRepo.save(model);
        return saved;
    }

    async findTeachers(yearId: string) {
        const teachers = await this.teacherRepo.findBy({
            year: { id: yearId },
            isActive: true,
        });

        return await Promise.all(
            teachers.map(async (x) => {
                const user = await x.profile.user;
                return new TeacherResponseDto(x, user.email);
            }),
        );
    }

    findTeacherById(id: string, yearId: string) {
        return this.teacherRepo.findOneBy({ id, year: { id: yearId } });
    }
}
