import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceDetailService } from '@shega/attendance/attendance-detail.service';
import { CreateEventAttendanceDto } from '@shega/attendance/dto/request/create-event-attendance.dto';
import { DocumentService } from '@shega/document/document.service';
import type { OrganizationService } from '@shega/organization/services/organization.service';
import { Express } from 'express';
import { Repository } from 'typeorm';
import { CreateEventRequestDto } from './dto/request/create-event.request.dto';
import { Event } from './entity/event.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
        private readonly documentService: DocumentService,
        private readonly attendanceDetailService: AttendanceDetailService,
        private readonly organizationService: OrganizationService,
    ) {}

    async create(
        dto: CreateEventRequestDto,
        organizationId: string,
        file?: Express.Multer.File,
    ) {
        const organization =
            await this.organizationService.findOneOrThrow(organizationId);
        const event = this.eventRepo.create(dto);
        event.organization = organization;
        const savedEvent = await this.eventRepo.save(event);

        if (file) {
            this.documentService
                .create(file, savedEvent.id)
                .then((documentId) => {
                    savedEvent.imageUrl = documentId;
                    return this.eventRepo.save(savedEvent);
                })
                .catch((err) => {
                    // console.error('Async upload failed:', err.message);
                });
        }

        return savedEvent;
    }

    async createAttendance(eventId: string, dto: CreateEventAttendanceDto) {
        const event = await this.findOne(eventId);

        if (!event) {
            throw new NotFoundException('Event Not Found');
        }

        const attendancePayload = {
            ...dto,
            referenceId: eventId,
        };

        const attendance =
            await this.attendanceDetailService.create(attendancePayload);
        return attendance;
    }

    async getEventAttendances(referenceId: string) {
        const event = await this.findOne(referenceId);

        if (!event) {
            throw new NotFoundException('Event not Found');
        }

        return this.attendanceDetailService.findByReferenceId(referenceId);
    }

    async findAll(organizationId: string) {
        return await this.eventRepo.findBy({
            organization: { id: organizationId },
        });
    }

    async findOne(id: string) {
        return await this.eventRepo.findOneBy({ id });
    }

    async update(id: string, updateData: Partial<Event>): Promise<Event> {
        await this.eventRepo.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.eventRepo.delete(id);
    }
}
