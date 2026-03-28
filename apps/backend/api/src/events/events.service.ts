import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AttendanceDetailService } from "@shega/attendance/attendance-detail.service";
import { CreateEventAttendanceDto } from "@shega/attendance/dto/request/create-event-attendance.dto";
import { DocumentService } from "@shega/document/document.service";
import { OrganizationService } from "@shega/organization/services/organization.service";
import { In, Repository } from "typeorm";
import { CreateEventRequestDto } from "./dto/request/create-event.request.dto";
import { Event } from "./entity/event.entity";
import { EventMember } from "./entity/event-member.entity";
import { OrganizationMembers } from "@shega/organization/entities/organization-member.entity";
import { AssignMembersToEventDto } from "./dto/request/assign-members-to-event.dto";
import { EventMemberResponseDto } from "./dto/response/event-member-response.dto";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventMember)
    private readonly eventMemberRepo: Repository<EventMember>,
    @InjectRepository(OrganizationMembers)
    private readonly memberRepo: Repository<OrganizationMembers>,
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
      throw new NotFoundException("Event Not Found");
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
      throw new NotFoundException("Event not Found");
    }

    return this.attendanceDetailService.findByReferenceId(referenceId);
  }

  async assignMembers(eventId: string, dto: AssignMembersToEventDto) {
    const event = await this.eventRepo.findOneBy({ id: eventId });

    if (!event) {
      throw new NotFoundException("Event not Found");
    }

    const members = await this.memberRepo.find({
      where: { id: In(dto.memberIds) },
    });

    const existing = await this.eventMemberRepo.find({
      where: {
        event: { id: eventId },
      },
    });

    const existingMemberIds = new Set(existing.map((e) => e.member.id));

    const newRelations = members
      .filter((m) => !existingMemberIds.has(m.id))
      .map((member) => {
        const em = new EventMember();
        em.event = event;
        em.member = member;
        return em;
      });

    return await this.eventMemberRepo.save(newRelations);
  }

  async getEventMembers(eventId: string): Promise<EventMemberResponseDto[]> {
    const relations = await this.eventMemberRepo.find({
      where: {
        event: { id: eventId },
      },
      relations: ["member", "member.profile"],
    });

    return relations.map((r) => {
      const dto = new EventMemberResponseDto();

      dto.id = r.member.id;
      dto.firstName = r.member.profile.firstName;
      dto.middleName = r.member.profile.middleName;
      dto.lastName = r.member.profile.lastName;
      dto.phoneNumber = r.member.profile.phoneNumber;
      
      dto.attendanceStatus = undefined;

      return dto;
    });
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
