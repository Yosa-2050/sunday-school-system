import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AttendanceDetailService } from "@shega/attendance/attendance-detail.service";
import {
  AttendanceDetailDataDto,
  AttendanceDetailDto,
} from "@shega/attendance/dto/request/create-attendance-detail.dto";
import { CreateEventAttendanceDto } from "@shega/attendance/dto/request/create-event-attendance.dto";
import {
  GetAttendanceDetailWithRefRequestDto,
  GetAttendanceWithRefRequestDto,
} from "@shega/attendance/dto/request/get-attendance.request.dto";
import { AttendanceStatus } from "@shega/attendance/enums/attendance-status.enum";
import { DocumentService } from "@shega/document/document.service";
import { OrganizationMembers } from "@shega/organization/entities/organization-member.entity";
import { OrganizationService } from "@shega/organization/services/organization.service";
import { In, Repository } from "typeorm";
import { AssignMembersToEventDto } from "./dto/request/assign-members-to-event.dto";
import { CreateEventRequestDto } from "./dto/request/create-event.request.dto";
import { EventAttendanceResponseDto } from "./dto/response/event-attendance-response.dto";
import { EventMemberResponseDto } from "./dto/response/event-member-response.dto";
import { Event } from "./entity/event.entity";
import { EventMember } from "./entity/event-member.entity";

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
          throw new NotFoundException
        });
    }

    return savedEvent;
  }

  async createAttendance(
    eventId: string,
    dto: CreateEventAttendanceDto,
    organizationId: string,
  ) {
    const event = await this.findOne(eventId);

    if (!event) {
      throw new NotFoundException("Event Not Found");
    }

    const attendancePayloads: AttendanceDetailDto = {
      referenceId: eventId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isCompleted: dto.isCompleted,
    };

    const { id } =
      await this.attendanceDetailService.create(attendancePayloads);

    const attendance: AttendanceDetailDataDto[] = dto.members
      .filter((member) => member.status !== undefined)
      .map((member) => ({
        memberId: member.memberId,
        referenceId: id,
        status: member.status,
        remarks: member.remarks,
      }));

    if (!attendance.length) {
      return [];
    }

    return await this.attendanceDetailService.createAttendance(attendance);
  }

  async getEventAttendancesDetail(
    organizationId: string,
    dto: GetAttendanceDetailWithRefRequestDto,
  ) {
    let eventLists = await this.findAll(organizationId);
    if (dto.referenceId) {
      eventLists = eventLists.filter((x) => x.id === dto.referenceId);
    }

    const eventNames = Object.fromEntries(
      eventLists.map((event) => [event.id, event.name]),
    );

    return this.attendanceDetailService.findByReferenceId(
      eventLists.map((x) => x.id),
      eventNames,
    );
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

  async completeEventAttendance(attendanceDetailId: string) {
    const attendanceDetail =
      await this.attendanceDetailService.findOne(attendanceDetailId);

    const event = await this.findOne(attendanceDetail.referenceId);

    if (!event) {
      throw new NotFoundException("Event not Found");
    }

    const members = await this.getEventMembers(event.id);

    if (!members.length) {
      throw new BadRequestException("No members assigned to this event");
    }

    return this.attendanceDetailService.completeAttendanceUpdate(
      attendanceDetailId,
      members.map((member) => member.id),
    );
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

  async getEventAttendances(
    organizationId: string,
    dto: GetAttendanceWithRefRequestDto,
  ) {
    if (!dto.referenceId) {
      throw new BadRequestException("Event mandatory");
    }

    let eventLists = await this.findAll(organizationId);
    eventLists = eventLists.filter((x) => x.id === dto.referenceId);
    if (!eventLists.length) {
      throw new NotFoundException("Event not Found");
    }

    const members = await this.getEventMembers(dto.referenceId);
    const attendance = await this.attendanceDetailService.getAllAttendance(
      dto.referenceId,
      dto.attendanceDataId,
    );

    return members.map((member) => {
      const memberAttendance = attendance.filter(
        (item) => item.memberId === member.id,
      );

      const response = new EventAttendanceResponseDto();
      response.memberId = member.id;
      response.firstName = member.firstName;
      response.middleName = member.middleName;
      response.lastName = member.lastName;
      response.phoneNumber = member.phoneNumber;
      response.name = [member.firstName, member.middleName, member.lastName]
        .filter(Boolean)
        .join(" ");
      response.present = memberAttendance.filter(
        (item) => item.status === AttendanceStatus.Present,
      ).length;
      response.absent = memberAttendance.filter(
        (item) => item.status === AttendanceStatus.Absent,
      ).length;
      response.late = memberAttendance.filter(
        (item) => item.status === AttendanceStatus.Late,
      ).length;
      response.permission = memberAttendance.filter(
        (item) => item.status === AttendanceStatus.Permission,
      ).length;
      response.total = memberAttendance.length;

      return response;
    });
  }
}
