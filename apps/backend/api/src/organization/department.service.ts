import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AddDepartmentRequestDto } from './dto/request/add-department.request.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentService {
    findOne(id: string) {
        return this.departmentRepository.findOne({ where: { id } });
    }
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
    ) {}
    create(dto: AddDepartmentRequestDto) {
        const department = this.departmentRepository.create(dto);
        return this.departmentRepository.save(department);
    }
    findAll() {
        return this.departmentRepository.find();
    }
    updateByName(id: string, name: string) {
        return this.departmentRepository.update({ id }, { name });
    }
    deleteByName(id: string) {
        return this.departmentRepository.delete({ id });
    }
}
