import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { DateService } from '@shega/Utilities/date.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentResponseDto } from '@shega/lms/dto/response/student.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { SubjectAssignment } from '@shega/lms/entities/subject-assignment.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from '@shega/lms/services/class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentService } from '@shega/lms/services/student.service';
// biome-ignore lint/style/useImportType: <explanation>
import { SubjectService } from '@shega/lms/services/subject.service';
// biome-ignore lint/style/useImportType: <explanation>
import { TeacherService } from '@shega/lms/services/teacher.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Between, In, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import {
    CreateAttendanceDto,
    StudentAttendance,
} from './dto/request/create-attendance.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
    GetAttendanceDetailRequestDto,
    GetAttendanceRequestDto,
} from './dto/request/get-attendance.request.dto';
import { AttendanceDetailResponse } from './dto/response/attendance-detail.response.dto';
import { AttendanceStudentResponse } from './dto/response/attendance.response.dto';
import { AttendanceInformation } from './entities/attendance-data.entity';
import { Attendance } from './entities/attendance.entity';
import { Permission } from './entities/permission.entity';
import { AttendanceStatus } from './enums/attendance-status.enum';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepo: Repository<Attendance>,
        @InjectRepository(AttendanceInformation)
        private attendanceDataRepo: Repository<AttendanceInformation>,
        @InjectRepository(Permission)
        private permissionRepo: Repository<Permission>,
        private classService: ClassService,
        private studentService: StudentService,
        private subjectService: SubjectService,
        private teacherService: TeacherService,
        private dateService: DateService,
    ) {}

    async createIndividual(
        dto: StudentAttendance,
        classId: string,
        activeCalendarYear: string,
    ) {
        const student = await this.studentService.findStudentsByClassId(
            dto.studentId,
            classId,
        );
        if (!student) {
            throw new EntityNotFoundException('Student');
        }
        const currentDate = this.dateService.getCurrentDate();
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        let existingAttendance = await this.attendanceDataRepo.findOneBy({
            class: { id: classId },
            date: Between(startOfDay, endOfDay), // Find between start and end of day
        });

        if (existingAttendance.isCompleted) {
            throw new BadRequestException('Attendance completed');
        }

        const classes = await this.classService.isClassValid(
            classId,
            activeCalendarYear,
        );
        if (!existingAttendance) {
            const attendanceInfo = this.attendanceDataRepo.create();
            attendanceInfo.date = currentDate;
            attendanceInfo.class = classes;
            existingAttendance =
                await this.attendanceDataRepo.save(attendanceInfo);
        }

        const existingAtt = await this.attendanceRepo.findOneBy({
            student: { id: student.id },
            attendanceDataId: existingAttendance.id,
        });
        if (existingAtt) {
            throw new EntityAlreadyExistsException('Attendance');
        }
        const attendance = this.attendanceRepo.create();
        attendance.attendanceDataId = existingAttendance.id;
        attendance.student = student;
        attendance.status = dto.status;
        return this.attendanceRepo.save(attendance);
    }

    async create(
        dto: CreateAttendanceDto,
        classId: string,
        activeCalendarYear: string,
        programId: string,
    ) {
        let existingAttendance: AttendanceInformation;

        let subject: SubjectAssignment;
        if (dto.subjectId) {
            existingAttendance = await this.attendanceDataRepo.findOneBy({
                class: { id: classId },
                subject: { id: dto.subjectId },
                date: dto.date,
            });

            if (existingAttendance) {
                throw new BadRequestException(
                    'Attendance found on the selected date',
                );
            }
            subject = await this.subjectService.getAssignedSubjectByIdOrThrow(
                dto.subjectId,
            );
        } else {
            existingAttendance = await this.attendanceDataRepo.findOneBy({
                class: { id: classId },
                date: dto.date,
            });

            if (existingAttendance) {
                throw new BadRequestException(
                    'Attendance found on the selected date',
                );
            }
        }

        const classes = await this.classService.isClassValid(
            classId,
            activeCalendarYear,
        );
        const attendanceInfo = this.attendanceDataRepo.create();
        attendanceInfo.date = dto.date;
        attendanceInfo.class = classes;
        attendanceInfo.subject = subject;
        const saved = await this.attendanceDataRepo.save(attendanceInfo);

        const students = await this.studentService.findStudents(
            classId,
            activeCalendarYear,
        );

        if (students?.length > 0) {
            const attendance = dto.attendance
                .map((attDto) => {
                    const std = students.find((x) => x.id === attDto.studentId);

                    if (std) {
                        if (attDto.status === AttendanceStatus.Absent) {
                            attDto.status = CheckIsPermissionStudent(
                                std,
                                dto.date,
                            )
                                ? AttendanceStatus.Permission
                                : AttendanceStatus.Absent;
                        }
                        return this.attendanceRepo.create({
                            student: std,
                            status: attDto.status,
                            attendanceDataId: saved.id,
                        });
                    }
                })
                .filter((att) => att);

            if (attendance?.length === 0) {
                throw new BadRequestException(
                    'No student found for the attendance',
                );
            }

            //attendanceInfo.attendances = attendance;
            await this.attendanceRepo.save(attendance);
            return UtilityServices.SuccessDataResponse();
        }
        throw new BadRequestException('No student found for the attendance');
    }

    findAll() {
        return this.attendanceRepo.find();
    }

    async findDates(classId: string, activeYear: string) {
        await this.classService.isClassValid(classId, activeYear);

        return this.attendanceDataRepo.findBy({ class: { id: classId } });
    }

    async findAttendanceList(get: GetAttendanceRequestDto, activeYear: string) {
        //TODO: refactor attendance fetching
        await this.classService.isClassValid(get.classId, activeYear);
        let startDate = new Date('1000-01-01');
        let endDate = new Date('2500-12-31');

        if (get.startDate) {
            startDate = new Date(get.startDate);
        }

        if (get.endDate) {
            endDate = new Date(get.endDate);
        }

        let attendance: Attendance[] = [];
        let totalAttendance = 0;
        let attendanceInfo: AttendanceInformation[] = [];
        if (get.attendanceInfoId) {
            const info = await this.attendanceDataRepo.findOneBy({
                id: get.attendanceInfoId,
            });
            attendance = await this.attendanceRepo.findBy({
                attendanceDataId: info.id,
            });
            totalAttendance = 1;
            attendanceInfo.push(info);
        } else {
            attendanceInfo = await this.attendanceDataRepo.find({
                where: {
                    date: Between(startDate, endDate),
                },
            });
            const uniqueInfoIds = attendanceInfo.map((item) => item.id);
            const allAttendances = await this.attendanceRepo.findBy({
                attendanceDataId: In(uniqueInfoIds),
            });

            totalAttendance = attendanceInfo.length;

            attendanceInfo.sort((a, b) => {
                return a.date.getTime() - b.date.getTime();
            });

            for (let index = 0; index < attendanceInfo.length; index++) {
                const element = allAttendances.filter(
                    (x) => x.attendanceDataId === attendanceInfo[index].id,
                );

                attendance = attendance.concat(element);
            }
        }

        const students = await this.studentService.findStudents(
            get.classId,
            activeYear,
        );
        const uniqueIds = students.map((item) => item.id);

        const attendanceList = uniqueIds
            .map((element) => {
                const attend = attendance.filter(
                    (x) => x.student.id === element,
                );
                const std = students.find((x) => x.id === element);

                const att = new AttendanceStudentResponse(
                    attend,
                    std,
                    attendanceInfo,
                );
                if (att?.idNumber) {
                    return att;
                }
            })
            .filter((x) => x);
        return attendanceList;
    }

    async Complete(id: string, arg1: string) {
        const attend = await this.attendanceDataRepo.findOneBy({ id });
        if (!attend) {
            throw new EntityNotFoundException('Attendance');
        }
        attend.isCompleted = true;
        return this.attendanceDataRepo.save(attend);
    }

    async findAttendanceDetailList(
        dto: GetAttendanceDetailRequestDto,
        arg1: string,
    ) {
        let details: AttendanceInformation[];
        if (!dto.classId) {
            details = await this.attendanceDataRepo.find();
        }
        if (dto.subjectId) {
            details = await this.attendanceDataRepo.findBy({
                subject: { id: dto.subjectId },
            });
        }
        if (dto.classId) {
            details = await this.attendanceDataRepo.findBy({
                class: { id: dto.classId },
            });
        }
        const response = [];
        for (let index = 0; index < details.length; index++) {
            const element = details[index];
            const present = await this.attendanceRepo.count({
                where: {
                    status: AttendanceStatus.Present,
                    attendanceDataId: element.id,
                },
            });
            const absent = await this.attendanceRepo.count({
                where: {
                    status: AttendanceStatus.Absent,
                    attendanceDataId: element.id,
                },
            });
            response.push(
                new AttendanceDetailResponse(element, present, absent),
            );
        }
        return response;
    }
    /** 
  async findAttendanceListBySchedule(
    get: GetAttendanceRequestDto,
    activeCalendarYear: string
  ) {
    //TODO: refactor attendance fetching
    var schedule_detail_ids: ScheduleDetail[] =
      await this.GetScheduleDetailsFromRequest(get, activeCalendarYear);

    const lists: AttendanceByScheduleDetailResponseDto[] = [];
    for (let index = 0; index < schedule_detail_ids.length; index++) {
      const element = await schedule_detail_ids[index].attendance;

      lists.push(
        new AttendanceByScheduleDetailResponseDto(
          schedule_detail_ids[index],
          element
        )
      );
    }
    return lists;
  }

  async reportByGroup(get: GetAttendanceRequestDto, subscriptionId: string) {
    var schedule_detail_ids: ScheduleDetail[] =
      await this.GetScheduleDetailsFromRequest(get, subscriptionId);

    var allStudents = await this.classService.getAllStudents(
      get.sectionId,
      subscriptionId
    );

    allStudents = allStudents.filter((x) => x.isActive);

    var groups = [...new Set(allStudents.map((x) => x.group.trim()))];

    var result: GetReportBarByGroup[] = [];
    var lists: Attendance[] = [];

    for (let index = 0; index < schedule_detail_ids.length; index++) {
      const element = await schedule_detail_ids[index].attendance;

      lists = lists.concat(element);
    }

    //Main logic

    groups.forEach((gr) => {
      var students = lists.filter(
        (x) => x.student?.group.trim() === gr.trim() && x.student.isActive
      );

      var totalCount = students.length;
      var totalPresnet = students.filter(
        (x) => x.is_permission || x.is_present
      ).length;
      var percentage = (totalPresnet / totalCount) * 100;

      result.push({
        groupName: gr,
        percentage: percentage,
        totalCount: totalCount,
        totalPresnet: totalPresnet,
      });
    });

    result.sort((a, b) => {
      return a.percentage - b.percentage;
    });
    return result;
  }

  async lineGraphPerDayReportByGroup(
    getAttendance: GetAttendanceRequestDto,
    activeCalendarYear: string
  ) {
    var schedule_detail_ids: ScheduleDetail[] =
      await this.GetScheduleDetailsFromRequest(
        getAttendance,
        activeCalendarYear
      );

    var allStudents = await this.classService.getAllStudents(
      getAttendance.sectionId,
      activeCalendarYear
    );
    var groups = [...new Set(allStudents.map((x) => x.group))];

    var result: LineGraphPerDayReportByGroup[] = [];
    var lists: Attendance[] = [];

    for (let index = 0; index < schedule_detail_ids.length; index++) {
      const element = await schedule_detail_ids[index].attendance;

      lists = lists.concat(element);
    }

    //Main logic
    groups.forEach((gr) => {
      var datas: GraphPerDayArray[] = [];

      schedule_detail_ids?.forEach((scd) => {
        var students = lists.filter(
          (x) => x.student?.group === gr && x.schedule_detail?.id === scd.id
        );
        var totalCount = students.length;
        var totalPresnet = students.filter(
          (x) => x.is_permission || x.is_present
        ).length;
        var percentage = (totalPresnet / totalCount) * 100;
        datas.push({
          date: scd.date,
          percentage: percentage,
          totalCount: totalCount,
          totalPresnet: totalPresnet,
          schedule_detail_id: scd.id,
        });
      });

      result.push({
        groupName: gr,
        datas: datas,
      });
    });

    return {
      result: result,
      schedule_detail_ids: schedule_detail_ids,
    };
  }

  private async GetScheduleDetailsFromRequest(
    get: GetAttendanceRequestDto,
    subscriptionId: string
  ) {
    var allSchedules = await this.classService.getAllSchedules(
      get.sectionId,
      get.termId,
      subscriptionId
    );

    if (get.registered_subject_id.length > 0) {
      allSchedules = allSchedules?.filter((x) => {
        if (x.registerd_subject_id === get.registered_subject_id) {
          return x;
        }
      });
    }

    if (get.schedule_id.length > 0) {
      allSchedules = allSchedules?.filter((x) => {
        if (x.schedule_id === get.schedule_id) {
          return x;
        }
      });
    }

    var startDate = new Date(-8640000000000000);
    var endDate = new Date(8640000000000000);

    if (get.start_date) {
      startDate = new Date(get.start_date);
    }

    if (get.end_date) {
      endDate = new Date(get.end_date);
    }

    var schedule_detail_ids: ScheduleDetail[] = [];

    if (get.schedule_detail_id.length > 0) {
      var schedule_detail = await this.scheduleDetailService.findOne(
        get.schedule_detail_id
      );

      var attendace = await schedule_detail.attendance;
      schedule_detail_ids.push(schedule_detail);
    } else {
      for (let index = 0; index < allSchedules.length; index++) {
        const element = await this.scheduleService.findOne(
          allSchedules[index]?.schedule_id
        );
        element.scheduleDetail = element.scheduleDetail.filter(
          (x) => x.date >= startDate && x.date <= endDate
        );
        schedule_detail_ids = schedule_detail_ids.concat(
          element.scheduleDetail
        );
      }
    }
    return schedule_detail_ids;
  }

  async addPermission(permission: CreatePermissionRequestDto) {
    const student = await this.studentService.findOne(permission.studentId);
    if (!student) { throw new BadRequestException("Student not found"); }
    const per = this.permissionRepo.create();
    per.student = student;
    per.type = permission.type;
    switch (permission.type) {
      case PermissionType.DayOfTheWeek:
        if (permission.day) {
          per.value = DayOfTheWeeks[permission.day];
        }
        break;
      default:
        throw new BadRequestException("Permission type not allowed");
    }

    return this.permissionRepo.save(per);
  }

  async getPermission(id: string, activeCalendarYear: string) {
    const students = await this.studentService.findStudents(
      id,
      activeCalendarYear
    );
    const allPermissions: GetAllPermission[] = [];
    for (const key in students) {
      const student = students[key];
      student?.permissions?.forEach((permission) => {
        allPermissions.push(new GetAllPermission(student, permission));
      });
    }
    return allPermissions;
  }
    */
}

function CheckIsPermissionStudent(
    student: StudentResponseDto,
    date: Date,
): boolean {
    const returnVal = false;
    // student?.permissions?.forEach((per) => {
    //   if (per.isActive) {
    //     switch (per.type) {
    //       case PermissionType.DayOfTheWeek.toString():
    //         if (
    //           per.value.toLowerCase() === dayOfWeek[date.getDay()].toLowerCase()
    //         ) {
    //           returnVal = true;
    //         }
    //         break;
    //     }
    //   }
    // });

    return returnVal;
}
