import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentResponseDto } from '@shega/lms/dto/response/student.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from '@shega/lms/services/class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentService } from '@shega/lms/services/student.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Between, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateAttendanceDto } from './dto/request/create-attendance.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetAttendanceRequestDto } from './dto/request/get-attendance.request.dto';
import {
    AttendanceResponse,
    AttendanceStudentResponse,
} from './dto/response/attendance.response.dto';
import { AttendanceInformation } from './entities/attendance-data.entity';
import { Attendance } from './entities/attendance.entity';
import { Permission } from './entities/permission.entity';
import { AttendanceStatus } from './enums/attendance-status.enum';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance) private repo: Repository<Attendance>,
        @InjectRepository(AttendanceInformation)
        private attendanceDataRepo: Repository<AttendanceInformation>,
        @InjectRepository(Permission)
        private permissionRepo: Repository<Permission>,
        private classService: ClassService,
        private studentService: StudentService,
    ) {}

    async create(
        dto: CreateAttendanceDto,
        classId: string,
        activeCalendarYear: string,
    ) {
        const existingAttendance = await this.attendanceDataRepo.findOneBy({
            class: { id: classId },
            date: dto.date,
        });
        if (existingAttendance) {
            throw new BadRequestException(
                'Attendance found on the selected date',
            );
        }

        const classes = await this.classService.isClassValid(
            classId,
            activeCalendarYear,
        );
        const attendanceInfo = this.attendanceDataRepo.create();
        attendanceInfo.date = dto.date;
        attendanceInfo.class = classes;

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
                        return this.repo.create({
                            student: std,
                            status: attDto.status,
                        });
                    }
                })
                .filter((att) => att);

            if (attendance?.length === 0) {
                throw new BadRequestException(
                    'No student found for the attendance',
                );
            }

            attendanceInfo.attendances = attendance;
            await this.attendanceDataRepo.save(attendanceInfo);
            return UtilityServices.SuccessDataResponse();
        }
        throw new BadRequestException('No student found for the attendance');
    }

    findAll() {
        return this.repo.find();
    }

    async findAttendanceList(get: GetAttendanceRequestDto, activeYear: string) {
        //TODO: refactor attendance fetching
        const classes = await this.classService.isClassValid(
            get.classId,
            activeYear,
        );
        let startDate = new Date(-8640000000000000);
        let endDate = new Date(8640000000000000);

        if (get.startDate) {
            startDate = new Date(get.startDate);
        }

        if (get.endDate) {
            endDate = new Date(get.endDate);
        }

        let attendance: Attendance[] = [];
        let totalAttendance = 0;

        if (get.attendanceInfoId) {
            const attendanceInfo = await this.attendanceDataRepo.findOneBy({
                id: get.attendanceInfoId,
            });

            attendance = await attendanceInfo.attendances;
            totalAttendance = 1;
        } else {
            const attendanceInfo = await this.attendanceDataRepo.find({
                where: {
                    date: Between(startDate, endDate),
                },
            });

            totalAttendance = attendanceInfo.length;

            attendanceInfo.sort((a, b) => {
                return a.date.getTime() - b.date.getTime();
            });

            for (let index = 0; index < attendanceInfo.length; index++) {
                const element = await attendanceInfo[index].attendances;

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

                const att = new AttendanceStudentResponse(attend, std);
                if (att?.idNumber) {
                    return att;
                }
            })
            .filter((x) => x);

        const result = new AttendanceResponse();
        result.attendances = attendanceList;
        //result.scheduleDays = attin;
        return result;
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
