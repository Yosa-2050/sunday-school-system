import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AddSubjectAssignmentDto } from '../dto/request/add-subject-assignment.request.dto';
import { SubjectResponseDto } from '../dto/response/subject.response.dto';
import { Program } from '../entities/program.entity';
import { SubjectAssignment } from '../entities/subject-assignment.entity';
import { Subjects } from '../entities/subject.entity';
import { TeacherAssignment } from '../entities/teacher-assignment.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from './class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { TeacherService } from './teacher.service';

@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(Subjects) private subjectRepo: Repository<Subjects>,
        @InjectRepository(Program) private programRepo: Repository<Program>,
        @InjectRepository(SubjectAssignment)
        private subjectAssignmentRepo: Repository<SubjectAssignment>,
        @InjectRepository(TeacherAssignment)
        private teacherAssignmentRepo: Repository<TeacherAssignment>,
        private classService: ClassService,
        private teacherService: TeacherService,
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

    async update(id: string, name: string, programId: string) {
        const subject = await this.subjectRepo.findOneBy({
            id,
            program: { id: programId },
        });
        if (!subject) {
            throw new EntityNotFoundException(Subjects.name);
        }
        subject.name = name;
        return this.subjectRepo.save(subject);
    }

    findAllRootSubjects(programId: string) {
        return this.subjectRepo.find({
            where: { program: { id: programId } },
        });
    }

    async findOneByProgramIdOrThrow(id: string, programId: string) {
        const sub = await this.subjectRepo.findOneBy({
            id,
            isActive: true,
            program: { id: programId },
        });
        if (!sub) {
            throw new EntityNotFoundException('Subject');
        }
        return sub;
    }

    async assignSubject(
        dto: AddSubjectAssignmentDto,
        programId: string,
        yearId: string,
    ) {
        const existing = await this.subjectAssignmentRepo.findOneBy({
            class: { id: dto.classId },
            subject: { id: dto.subjectId },
        });
        if (existing) {
            throw new EntityAlreadyExistsException('Assigned Subject');
        }
        const cls = await this.classService.findOne(dto.classId, yearId);
        const subject = await this.findOneByProgramIdOrThrow(
            dto.subjectId,
            programId,
        );
        const teacher = await this.teacherService.findTeacherById(
            dto.teacherId,
            yearId,
        );
        if (dto.teacherId && !teacher) {
            throw new EntityNotFoundException('Teacher');
        }
        const subjAssignment = this.subjectAssignmentRepo.create();
        subjAssignment.class = cls;
        subjAssignment.subject = subject;
        subjAssignment.subjectTitle = dto.subjectTitle;
        if (teacher) {
            const teacherAssignment = await this.teacherAssignmentRepo.create();
            teacherAssignment.subjectAssignment = subjAssignment;
            teacherAssignment.teacher = teacher;
            teacherAssignment.teacherType = dto.teacherType;
            teacherAssignment.isMain = true;
            return this.teacherAssignmentRepo.save(teacherAssignment);
        }
        return this.subjectAssignmentRepo.save(subjAssignment);
    }

    async getAssignedSubject(classId: string, yearId: string) {
        const cls = await this.classService.findOne(classId, yearId);

        const subjects = await cls.subjects;
        return subjects.map((x) => new SubjectResponseDto(x));
    }

    async getAssignedSubjectByIdOrThrow(id: string) {
        const subjAssignment = await this.subjectAssignmentRepo.findOneBy({
            id,
        });

        if (!subjAssignment) {
            throw new EntityNotFoundException('Subject Assignment');
        }

        return subjAssignment;
    }

    async getAssignedTeachers(
        classId: string,
        subjectId: string,
        yearId: string,
    ) {
        await this.classService.findOne(classId, yearId);

        const assign = await this.subjectAssignmentRepo.findOneBy({
            class: { id: classId },
            subject: { id: subjectId },
        });
        if (!assign) {
            throw new EntityNotFoundException('Subject Assignment');
        }

        const teachers = await this.teacherAssignmentRepo.findBy({
            subjectAssignment: { id: assign.id },
        });

        return teachers;
    }
}
