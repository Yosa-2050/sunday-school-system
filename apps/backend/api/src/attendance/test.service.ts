import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { SubjectAssignment } from '@shega/lms/entities/subject-assignment.entity';
import type { Repository } from 'typeorm/repository/Repository';
import type { TestRequestDto } from './dto/request/create-test.request.dto';
import { Test } from './entities/test.entity';

@Injectable()
export class TestService {
    constructor(
        @InjectRepository(Test)
        private readonly testRepository: Repository<Test>,
        @InjectRepository(SubjectAssignment)
        private readonly subjectAssignmentRepository: Repository<SubjectAssignment>,
    ) {}
    async create(dto: TestRequestDto) {
        const subjectAssignment =
            await this.subjectAssignmentRepository.findOne({
                where: { id: dto.subjectId },
            });
        if (!subjectAssignment) {
            throw new EntityNotFoundException('Subject Assignment');
        }
        const test = this.testRepository.create(dto);
        test.subject = subjectAssignment;

        return this.testRepository.save(test);
    }

    async remove(id: string) {
        const test = await this.testRepository.findOne({ where: { id } });
        if (!test) {
            throw 'Test not found';
        }
        await this.testRepository.remove(test);
        return { message: 'Test deleted successfully' };
    }

    findAll() {
        return this.testRepository.find();
    }
    findOne(id: string) {
        return this.testRepository.findOne({ where: { id } });
    }
    update(id: string, dto: TestRequestDto) {
        return this.testRepository.update({ id }, dto);
    }
    delete(id: string) {
        return this.testRepository.delete({ id });
    }
    findBySubjectId(subjectId: string) {
        return this.testRepository.find({
            where: { subject: { id: subjectId } },
        });
    }
}
