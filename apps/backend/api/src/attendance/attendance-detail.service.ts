import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AttendanceDetailSummaryResponseDto } from "@shega/attendance/dto/response/attendance-detail-summary.response.dto";
import { AttendanceStatus } from "@shega/attendance/enums/attendance-status.enum";
import { In, Repository } from "typeorm";
import { AttendanceDetailDataDto, AttendanceDetailDto } from "./dto/request/create-attendance-detail.dto";
import { UpdateAttendanceDetailDto } from "./dto/request/update-attendance-detail.dto";
import { AttendanceDetail } from "./entities/attendance-detail.entity";
import { Attendance } from "./entities/attendance.entity";

@Injectable()
export class AttendanceDetailService {

  constructor(
    @InjectRepository(AttendanceDetail)
    private attendanceDetailRepo: Repository<AttendanceDetail>,
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  async create(dto: AttendanceDetailDto) {
    const attendance = this.attendanceDetailRepo.create(dto);
    return await this.attendanceDetailRepo.save(attendance);
  }

  async createAttendance(dto: AttendanceDetailDataDto[]) {
    const attendances = this.attendanceRepo.create(dto);
    return await this.attendanceRepo.save(attendances);
  }

  async findByReferenceId(referenceId: string[], referenceNames?: Record<string, string>) {
    const attendancesDetail = await this.attendanceDetailRepo.find({
      where: { referenceId: In(referenceId) },
    });

    if (!attendancesDetail.length) {
      throw new NotFoundException("No attendance found for this referenceId");
    }

    const attendances = await this.attendanceRepo.find({
      where: { referenceId: In(attendancesDetail.map((detail) => detail.id)) },
    });

    const attendanceByDetailId = new Map<string, Attendance[]>();

    for (const attendance of attendances) {
      const detailAttendance = attendanceByDetailId.get(attendance.referenceId) ?? [];
      detailAttendance.push(attendance);
      attendanceByDetailId.set(attendance.referenceId, detailAttendance);
    }

    return attendancesDetail.map(
      (detail) =>
        new AttendanceDetailSummaryResponseDto(
          detail,
          attendanceByDetailId.get(detail.id) ?? [],
          referenceNames?.[detail.referenceId],
        ),
    );
  }

  async completeAttendanceUpdate(id: string, memberIds: string[]) {
    const detail = await this.findOne(id);

    if (detail.isCompleted) {
      throw new BadRequestException("Attendance already completed");
    }

    if (!memberIds.length) {
      throw new BadRequestException("No members found for this attendance");
    }

    const attendances = await this.attendanceRepo.find({
      where: { referenceId: id },
    });

    const uniqueMemberIds = [...new Set(memberIds)];
    const existingMemberIds = new Set(
      attendances.map((attendance) => attendance.memberId),
    );
    const missingMemberIds = uniqueMemberIds.filter(
      (memberId) => !existingMemberIds.has(memberId),
    );

    if (missingMemberIds.length) {
      const absentAttendances = this.attendanceRepo.create(
        missingMemberIds.map((memberId) => ({
          memberId,
          referenceId: id,
          status: AttendanceStatus.Absent,
          remarks: null,
        })),
      );

      await this.attendanceRepo.save(absentAttendances);
    }

    detail.isCompleted = true;
    await this.attendanceDetailRepo.save(detail);

    return {
      message: "Attendance completed successfully",
      addedAbsentCount: missingMemberIds.length,
    };
  }

  async findAll() {
    return await this.attendanceDetailRepo.find();
  }

  async findOne(id: string) {
    const attendance = await this.attendanceDetailRepo.findOne({ where: { id } });

    if (!attendance) {
      throw new NotFoundException("Attendance not Found");
    }
    return attendance;
  }

  async update(id: string, dto: UpdateAttendanceDetailDto) {
    const attendance = await this.findOne(id);

    Object.assign(attendance, dto);

    return await this.attendanceDetailRepo.save(attendance);
  }

  async remove(id: string) {
    const attendance = await this.findOne(id);
    return this.attendanceDetailRepo.remove(attendance);
  }

  async getAllAttendance(referenceId: string, attendanceDetailId?: string) {
    const references = await this.findByReferenceId([referenceId]);
    let allRefs = references.map(x => x.id);
    if(attendanceDetailId)
      allRefs = allRefs.filter(x => x === attendanceDetailId);
    return this.attendanceRepo.find({
      where: { referenceId: In(allRefs) },
    });
  }
}
