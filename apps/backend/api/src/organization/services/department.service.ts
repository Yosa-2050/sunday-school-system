import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AddDepartmentRequestDto } from '../dto/request/add-department.request.dto';
import { Department } from '../entities/department.entity';

@Injectable()
export class DepartmentService {
    findAll() {
        return this.departmentRepository
            .createQueryBuilder('department')
            .where('department.parentId IS NULL')
            .getMany();
    }
    async findOne(id: string) {
        const department = await this.departmentRepository.findOne({
            where: { id },
        });
        if (!department) {
            throw new EntityNotFoundException('Department');
        }
        return department;
    }
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
    ) {}
    async create(dto: AddDepartmentRequestDto, parentId?: string) {
        const department = this.departmentRepository.create(dto);
        if (dto.parentId) {
            const parent = await this.findOne(dto.parentId);
            department.parent = parent;
        }
        return this.departmentRepository.save(department);
    }

    async findAllByParentId(parentId?: string) {
        const parent = await this.departmentRepository.findOne({
            where: { id: parentId },
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
