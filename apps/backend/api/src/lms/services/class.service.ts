import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassRequestDto } from '../dto/request/create-class.request.dto';
import { Classes } from '../entities/classes.entity';
import { Program } from '../entities/program.entity';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Classes) private classRepo: Repository<Classes>,
        @InjectRepository(Program) private programRepo: Repository<Program>,
    ) {}

    async create(dto: ClassRequestDto, isRoot: boolean, parentId?: string) {
        if (isRoot) {
            const existingClass = await this.classRepo.findOneBy({
                name: dto.name,
                isRoot: true,
            });
            if (existingClass) {
                throw new BadRequestException(
                    `Classes exists with the name ${dto.name}`,
                );
            }
            return this.classRepo.save(
                this.classRepo.create({
                    ...dto,
                    isRoot: true,
                    hasSection: false,
                    isSection: false,
                }),
            );
        }
        if (!parentId) {
            throw new BadRequestException('Root class not provided');
        }
        const existingClass = await this.classRepo.findOneBy({
            name: dto.name,
            parent: { id: parentId },
        });
        if (existingClass) {
            throw new BadRequestException(
                `Classes exists with the same name ${dto.name}`,
            );
        }
        const parentClass = await this.findOne(parentId);
        if (!parentClass.isRoot) {
            throw new BadRequestException('Parent class should be root');
        }
        const classes = this.classRepo.create({
            ...dto,
            isRoot: false,
            hasSection: false,
            isSection: false,
        });
        classes.parent = parentClass;
        if (dto.section) {
            classes.sections = [];
            for (let index = 0; index < dto.section.length; index++) {
                const element = dto.section[index];
                (await classes.sections).push(
                    this.classRepo.create({
                        name: element,
                        isRoot: false,
                        hasSection: false,
                        isSection: true,
                    }),
                );
            }
        }
        return this.classRepo.save(classes);
    }

    findAll(isRoot: boolean) {
        return this.classRepo.findBy({ isRoot });
    }

    async isClassValid(id: string) {
        const validClass = await this.findOne(id);
        if (
            !validClass.isRoot &&
            validClass.isActive &&
            !validClass.hasSection
        ) {
            return validClass;
        }
        return null;
    }

    async findOne(id: string) {
        const _class = await this.classRepo.findOneBy({ id });
        if (!_class) {
            throw new EntityNotFoundException(typeof Classes);
        }
        return _class;
    }

    async findOneProgram(id: string) {
        const program = await this.programRepo.findOneBy({ id });
        if (!program) {
            throw new EntityNotFoundException(typeof Program);
        }
        return program;
    }

    async findSections(id: string) {
        const _class = await this.classRepo.findOneBy({ id });
        if (!_class) {
            throw new EntityNotFoundException(typeof Classes);
        }
        return _class.sections;
    }

    //   update(id: number, updateLmDto: UpdateLmDto) {
    //     return `This action updates a #${id} lm`;
    //   }

    remove(id: number) {
        return `This action removes a #${id} lm`;
    }

    getProgram() {
        return this.programRepo.find();
    }
    async createProgram(name: string) {
        const existingProgram = await this.programRepo.findOneBy({ name });
        if (existingProgram) {
            throw new EntityAlreadyExistsException(typeof Program);
        }
        const program = this.programRepo.create({ name });
        return this.programRepo.save(program);
    }
}
