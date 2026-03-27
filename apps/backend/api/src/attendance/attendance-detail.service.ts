import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { AttendanceDetailDto } from './dto/request/create-attendance-detail.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateAttendanceDetailDto } from './dto/request/update-attendance-detail.dto';
import { AttendanceDetail } from './entities/attendance-detail.entity';

@Injectable()
export class AttendanceDetailService {
    constructor(
        @InjectRepository(AttendanceDetail)
        private attendanceRepo: Repository<AttendanceDetail>,
    ) {}

    async create(dto: AttendanceDetailDto) {
        const attendance = this.attendanceRepo.create(dto);
        return await this.attendanceRepo.save(attendance);
    }

    async findByReferenceId(referenceId: string) {
        const attendances = await this.attendanceRepo.find({
            where: { referenceId },
        });

        if (!attendances.length) {
            throw new NotFoundException(
                'No attendance found for this referenceId',
            );
        }

        return attendances;
    }

    async findAll() {
        return await this.attendanceRepo.find();
    }

    async findOne(id: string) {
        const attendance = await this.attendanceRepo.findOne({ where: { id } });

        if (!attendance) {
            throw new NotFoundException('Attendance not Found');
        }
        return attendance;
    }

    async update(id: string, dto: UpdateAttendanceDetailDto) {
        const attendance = await this.findOne(id);

        Object.assign(attendance, dto);

        return await this.attendanceRepo.save(attendance);
    }

    async remove(id: string) {
        const attendance = await this.findOne(id);
        return this.attendanceRepo.remove(attendance);
    }
}
