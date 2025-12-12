import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AddDepartmentRequestDto } from '../dto/request/add-department.request.dto';
import { Department } from '../entities/department.entity';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class DepartmentService {
    findAll(organizationId: string) {
        return this.departmentRepository
            .createQueryBuilder('department')
            .where('department.parentId IS NULL')
            .andWhere('department.organizationId = :organizationId', {
                organizationId,
            })
            .getMany();
    }
    async findOne(id: string, organizationId: string) {
        const department = await this.departmentRepository.findOne({
            where: { id, organization: { id: organizationId } },
        });
        if (!department) {
            throw new EntityNotFoundException('Department');
        }
        return department;
    }
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
        @InjectRepository(Organization)
        private organizationRepo: Repository<Organization>,
    ) {}
    async create(dto: AddDepartmentRequestDto, organizationId: string) {
        const organization = await this.organizationRepo.findOneBy({
            id: organizationId,
        });
        if (!organization) {
            throw new EntityNotFoundException('Organization');
        }
        const department = this.departmentRepository.create(dto);
        if (dto.parentId) {
            const parent = await this.findOne(dto.parentId, organizationId);
            department.parent = parent;
        }
        department.organization = organization;
        return this.departmentRepository.save(department);
    }

    async findAllByParentId(parentId: string, organizationId: string) {
        const parent = await this.departmentRepository.findOne({
            where: { id: parentId, organization: { id: organizationId } },
        });
        if (!parent) {
            throw new EntityNotFoundException('Parent Department');
        }
        return parent.child;
    }

    updateByName(id: string, name: string) {
        return this.departmentRepository.update({ id }, { name });
    }
    deleteByName(id: string) {
        return this.departmentRepository.delete({ id });
    }
}
