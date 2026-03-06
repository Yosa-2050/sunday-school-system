import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AssignMemberDto } from '../dto/request/assign-member-to-department.request.dto';
import { DepartmentMember } from '../entities/department-member.entity';
import { Department } from '../entities/department.entity';

@Injectable()
export class DepartmentMemberService {
    constructor(
        @InjectRepository(DepartmentMember)
        private readonly departmentMemberRepository: Repository<DepartmentMember>,

        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
    ) {}

    async assignMember(organizationId: string, dto: AssignMemberDto) {
        const department = await this.departmentRepository.findOneBy({
            id: dto.departmentId,
            organization: { id: organizationId },
        });
        if (!department) {
            throw new EntityNotFoundException('department');
        }

        if (dto.subDepartmentId) {
            const department = await this.departmentRepository.findOneBy({
                id: dto.subDepartmentId,
                organization: { id: organizationId },
            });
            if (!department) {
                throw new EntityNotFoundException('sub department');
            }
        }
        const assignment = this.departmentMemberRepository.create({ ...dto });

        return await this.departmentMemberRepository.save(assignment);
    }

    async findAll(
        organizationId: string,
        departmentId?: string,
        subDepartmentId?: string,
    ) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const where: any = {
            departmentId,
            member: { organization: { id: organizationId } },
        };
        if (subDepartmentId) {
            where.subDepartmentId = subDepartmentId;
        }

        const members = await this.departmentMemberRepository.find({ where });

        return members.map((m) => ({
            departmentName: m.department?.name || '',
            subDepartmentName: m.subDepartment?.name || '',
            memberName: `${m.member?.profile?.firstName} ${m.member?.profile?.lastName}`,
            gender: m.member?.profile?.gender,
            position: m.position,
            startDate: m.startDate,
            endDate: m.endDate,
        }));
    }

    async findByDepartmentId(organizationId: string, departmentId: string) {
        const members = await this.departmentMemberRepository.find({
            where: {
                departmentId,
                member: { organization: { id: organizationId } },
            },
        });
        return members.map((m) => ({
            departmentName: m.department?.name || '',
            subDepartmentName: m.subDepartment?.name || '',
            memberName: `${m.member?.profile?.firstName} ${m.member?.profile?.lastName}`,
            gender: m.member?.profile?.gender,
            position: m.position,
            startDate: m.startDate,
            endDate: m.endDate,
        }));
    }

    async findDepartmentByMemberId(memberId: string) {
        const relation = await this.departmentMemberRepository.find({
            where: {
                member: { id: memberId },
            },
            relations: ['department', 'subDepartment'],
        });
        return relation;
    }
}
