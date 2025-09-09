import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { Classes } from '../entities/classes.entity';
import { Program } from '../entities/program.entity';
import { Subjects } from '../entities/subject.entity';

@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(Subjects) private subjectRepo: Repository<Subjects>,
        @InjectRepository(Classes) private classRepo: Repository<Classes>,
        @InjectRepository(Program) private programRepo: Repository<Program>,
    ) {}

    async create(name: string, programId: string) {
        const program = await this.programRepo.findOneBy({ id: programId });
        if (!program) {
            throw new EntityNotFoundException(Program.name);
        }
        const existingSubject = await this.subjectRepo.findOneBy({
            name: name,
            program: { id: programId },
        });
        if (existingSubject) {
            throw new EntityAlreadyExistsException(Subjects.name);
        }
        const create = this.subjectRepo.create({ name });
        create.program = program;
        return this.subjectRepo.save(create);
    }

    findAllRootSubjects(programId: string) {
        return this.subjectRepo.find({
            where: { program: { id: programId } },
        });
    }
}
