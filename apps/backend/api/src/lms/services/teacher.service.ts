import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { TeacherResponseDto } from '@shega/education/dto/response/teacher.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from '@shega/organization/dto/request/create-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationMemberService } from '@shega/organization/organization-member.service';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from './class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LmsService } from './lms.service';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
        private classService: ClassService,
        private memberService: OrganizationMemberService,
        private lmsService: LmsService,
    ) {}

    async CreateTeacher(dto: CreateEmployeeDto, yearId: string) {
        const cYear = await this.lmsService.calendarYearById(yearId);
        dto.role = UserRoleType.Teacher;
        const member = await this.memberService.CreateEmployee(dto);

        const model = this.teacherRepo.create();
        model.member = member;
        model.year = cYear;
        const saved = await this.teacherRepo.save(model);
        return saved;
    }

    async addExistingTeacher(memberId: string, yearId: string) {
        const cYear = await this.lmsService.calendarYearById(yearId);
        const member = await this.memberService.findByIdOrThrow(memberId);

        const teacher = await this.teacherRepo.findOneBy({
            member: { id: memberId },
        });
        if (teacher) {
            throw new EntityAlreadyExistsException('Teacher');
        }

        const model = this.teacherRepo.create();
        model.member = member;
        model.year = cYear;
        const saved = await this.teacherRepo.save(model);
        return UtilityServices.EnsureCreated(saved.id);
    }

    async findTeachers(yearId: string) {
        const teachers = await this.teacherRepo.findBy({
            year: { id: yearId },
            isActive: true,
        });

        return await Promise.all(
            teachers.map(async (x) => {
                const user = await x.member.profile.user;
                return new TeacherResponseDto(x, user.email);
            }),
        );
    }

    findTeacherById(id: string, yearId: string) {
        return this.teacherRepo.findOneBy({ id, year: { id: yearId } });
    }
}
