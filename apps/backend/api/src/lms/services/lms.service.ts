import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCalendarYearRequestDto } from '../dto/request/create-calendar-year.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLmDto } from '../dto/request/create-lm.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateLmDto } from '../dto/request/update-lm.dto';
import { CalendarYear } from '../entities/calendar-year.entity';
import { Program } from '../entities/program.entity';

@Injectable()
export class LmsService {
    constructor(
        @InjectRepository(CalendarYear)
        private calendarYearRepo: Repository<CalendarYear>,
        @InjectRepository(Program) private programRepo: Repository<Program>,
    ) {}

    async createCalendarYear(
        programId: string,
        dto: CreateCalendarYearRequestDto,
    ) {
        const program = await this.findOneProgram(programId);
        const existingProgram = await this.calendarYearRepo.findOneBy({
            name: dto.name,
            program: { id: programId },
        });
        if (existingProgram) {
            throw new EntityAlreadyExistsException(typeof Program);
        }
        const year = this.calendarYearRepo.create(dto);
        year.program = program;
        return this.calendarYearRepo.save(year);
    }
    create(createLmDto: CreateLmDto) {
        return 'This action adds a new lm';
    }

    findAllYear(programId: string) {
        return this.calendarYearRepo.findBy({ program: { id: programId } });
    }

    findOne(id: number) {
        return `This action returns a #${id} lm`;
    }

    update(id: number, updateLmDto: UpdateLmDto) {
        return `This action updates a #${id} lm`;
    }

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

    async findOneProgram(id: string) {
        const program = await this.programRepo.findOneBy({ id });
        if (!program) {
            throw new EntityNotFoundException(typeof Program);
        }
        return program;
    }
}
