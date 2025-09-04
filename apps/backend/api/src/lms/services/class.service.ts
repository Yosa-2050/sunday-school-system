import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassRequestDto } from '../dto/request/create-class.request.dto';
import { CalendarYear } from '../entities/calendar-year.entity';
import { Classes } from '../entities/classes.entity';
import { Program } from '../entities/program.entity';
import { RootClass } from '../entities/root-class.entity';

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

    async createRoot(name: string, programId: string) {
        const program = await this.programRepo.findOneBy({ id: programId });
        if (!program) {
            throw new EntityNotFoundException(typeof Program);
        }
        const existingClass = await this.rootClassRepo.findOneBy({
            name: name,
            program: { id: programId },
        });
        if (existingClass) {
            throw new EntityAlreadyExistsException(typeof RootClass);
        }
        const classes = this.rootClassRepo.create({ name });
        classes.program = program;
        return this.rootClassRepo.save(classes);
    }

    findAll(yearId: string) {
        return this.classRepo.find({
            where: { calendarYear: { id: yearId }, isSection: false },
            relations: ['sections'],
        });
    }

    findAllRootClass(programId: string) {
        return this.rootClassRepo.findBy({ program: { id: programId } });
    }

    async isClassValid(id: string, yearId: string) {
        const validClass = await this.findOne(id, yearId);
        if (validClass.isActive && !validClass.hasSection) {
            return validClass;
        }
        return null;
    }

    async findOne(id: string, yearId: string) {
        const _class = await this.classRepo.findOne({
            where: [
                { id, calendarYear: { id: yearId }, isSection: false },
                {
                    id,
                    parent: { calendarYear: { id: yearId } },
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
