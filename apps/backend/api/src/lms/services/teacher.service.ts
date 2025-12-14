import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { TeacherResponseDto } from '@shega/education/dto/response/teacher.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEmployeeDto } from '@shega/organization/dto/request/create-organization-member.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationMemberService } from '@shega/organization/services/organization-member.service';
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
        //TODO:
        const member = await this.memberService.CreateEmployee(dto, '');

        const model = this.teacherRepo.create();
        model.member = member;
        model.year = cYear;
        const saved = await this.teacherRepo.save(model);
        return saved;
    }

    async assignTeachers(calendarYearId: string, memberIds: string[]) {
        const calendarYear =
            await this.lmsService.calendarYearById(calendarYearId);

        const createdAssignments = [];

        for (const id of memberIds) {
            // Ensure teacher exists
            const teacher = await this.teacherRepo.findOne({
                where: { member: { id }, isActive: true },
                relations: ['member'],
            });

            if (teacher) {
                continue;
            }
            const member = await this.memberService.findByIdOrThrow(id);

            // Create assignment model
            const model = this.teacherRepo.create({
                member: member,
                year: calendarYear,
            });

            const saved = await this.teacherRepo.save(model);
            createdAssignments.push(saved.id);
        }

        return {
            success: true,
            assigned: createdAssignments,
        };
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
