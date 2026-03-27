import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { Repository } from 'typeorm';
import { ClassRequestDto } from '../dto/request/create-class.request.dto';
import { CalendarYear } from '../entities/calendar-year.entity';
import { Classes } from '../entities/classes.entity';
import { Program } from '../entities/program.entity';
import { RootClass } from '../entities/root-class.entity';
import { ProgramType } from '../enums/program-type.enums';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Classes) private classRepo: Repository<Classes>,
        @InjectRepository(RootClass)
        private rootClassRepo: Repository<RootClass>,
        @InjectRepository(CalendarYear)
        private calendarYearRepo: Repository<CalendarYear>,
        @InjectRepository(Program) private programRepo: Repository<Program>,
    ) {}

    async create(dto: ClassRequestDto, yearId: string) {
        const rootClass = await this.rootClassRepo.findOneBy({
            id: dto.rootId,
        });
        if (!rootClass) {
            throw new EntityNotFoundException('Root class');
        }

        const calendarYear = await this.calendarYearRepo.findOneBy({
            id: yearId,
        });
        if (!calendarYear) {
            throw new EntityNotFoundException('Calendar year');
        }
        const existingClass = await this.classRepo.findOneBy({
            root: { id: dto.rootId },
            calendarYear: { id: yearId },
        });
        if (existingClass) {
            throw new EntityAlreadyExistsException('Root class added');
        }

        const classes = this.classRepo.create({
            ...dto,
            hasSection: dto.section?.length > 0,
            isSection: false,
        });
        classes.root = rootClass;
        classes.calendarYear = calendarYear;
        if (dto.section) {
            classes.sections = [];
            for (let index = 0; index < dto.section.length; index++) {
                const element = dto.section[index];
                (await classes.sections).push(
                    this.classRepo.create({
                        name: element,
                        hasSection: false,
                        isSection: true,
                    }),
                );
            }
        }
        return this.classRepo.save(classes);
    }

    async update(id: string, dto: ClassRequestDto, yearId: string) {
        const classes = await this.findOne(id, yearId);
        if (!classes) {
            throw new EntityNotFoundException(Classes.name);
        }
        classes.name = dto.name;
        classes.description = dto.description;
        classes.hasSection = dto.section?.length > 0;

        if (dto.rootId && dto.rootId !== classes.root.id) {
            const rootClass = await this.rootClassRepo.findOneBy({
                id: dto.rootId,
            });
            if (!rootClass) {
                throw new EntityNotFoundException('Root class');
            }
            classes.root = rootClass;
        }

        await this.classRepo.delete({
            parent: { id: classes.id },
            isSection: true,
        });

        if (dto.section?.length) {
            classes.sections = dto.section.map((name) =>
                this.classRepo.create({
                    name: name,
                    hasSection: false,
                    isSection: true,
                }),
            );
        }

        return this.classRepo.save(classes);
    }

    async createRoot(name: string, programType: ProgramType) {
        const existingClass = await this.rootClassRepo.findOneBy({
            name: name,
            programType: programType,
        });
        if (existingClass) {
            throw new EntityAlreadyExistsException(typeof RootClass);
        }
        const classes = this.rootClassRepo.create({ name, programType });
        return this.rootClassRepo.save(classes);
    }

    findAll(yearId: string) {
        return this.classRepo.find({
            where: { calendarYear: { id: yearId }, isSection: false },
            relations: ['sections'],
        });
    }

    findAllRootClassByType(programType: ProgramType) {
        return this.rootClassRepo.findBy({ programType });
    }

    async findAllRootClassByProgram(programId: string, organizationId: string) {
        const program = await this.programRepo.findOneBy({
            id: programId,
            organization: { id: organizationId },
        });
        if (!program) {
            throw new EntityNotFoundException('Program');
        }
        return this.rootClassRepo.findBy({
            programType: program.programType,
        });
    }

    async isClassValid(id: string, yearId: string) {
        const validClass = await this.findOne(id, yearId);
        if (validClass.isActive && !validClass.hasSection) {
            return validClass;
        }
        return null;
    }

    async findOne(id: string, yearId?: string) {
        //TODO: to check class use different than year Id
        const _class = await this.classRepo.findOne({
            where: [
                {
                    id,
                    //calendarYear: { id: yearId },
                    isSection: false,
                },
                {
                    id,
                    //parent: { calendarYear: { id: yearId } },
                    isSection: true,
                },
            ],
        });

        if (!_class) {
            throw new EntityNotFoundException(typeof Classes);
        }
        return _class;
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
}
