import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/Utilities/current-user.utility';
import { UserContext } from 'src/auth/decorators/user.context.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { AttendanceService } from './attendance.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateAttendanceDto } from './dto/request/create-attendance.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetAttendanceRequestDto } from './dto/request/get-attendance.request.dto';

@ApiBearerAuth()
@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @Post(':classId')
    create(
        @Body() createAttendanceDto: CreateAttendanceDto,
        @Param('classId', new ParseUUIDPipe()) classId: string,
        @UserContext() user,
    ) {
        return this.attendanceService.create(
            createAttendanceDto,
            classId,
            CurrentUser.getActiveYear(user),
        );
    }

    @Post('/getAttendance')
    findAttendanceList(
        @Body() getAttendance: GetAttendanceRequestDto,
        @UserContext() user,
    ) {
        return this.attendanceService.findAttendanceList(
            getAttendance,
            CurrentUser.getActiveYear(user),
        );
    }

    // @Post("/getAttendanceBySchedule")
    // getAttendanceBySchedule(
    //   @Body() getAttendance: GetAttendanceRequestDto,
    //   @UserContext() user
    // ) {
    //   return this.attendanceService.findAttendanceListBySchedule(
    //     getAttendance,
    //     CurrentUser.getActiveSubscription(user)
    //   );
    // }

    // @Post("/reportByGroup")
    // reportByGroup(
    //   @Body() getAttendance: GetAttendanceRequestDto,
    //   @UserContext() user
    // ) {
    //   return this.attendanceService.reportByGroup(
    //     getAttendance,
    //     CurrentUser.getActiveSubscription(user)
    //   );
    // }

    // @Post("/lineGraphPerDayReportByGroup")
    // lineGraphPerDayReportByGroup(
    //   @Body() getAttendance: GetAttendanceRequestDto,
    //   @UserContext() user
    // ) {
    //   return this.attendanceService.lineGraphPerDayReportByGroup(
    //     getAttendance,
    //     CurrentUser.getActiveSubscription(user)
    //   );
    // }

    // @Post("/addPermission")
    // permission(@Body() dto: CreatePermissionRequestDto, @UserContext() user) {
    //   return this.attendanceService.addPermission(dto);
    // }

    // @Get("/allPermissions/:registerd_class_id")
    // getPermissions(
    //   @Param("registerd_class_id", new ParseUUIDPipe()) id: string,
    //   @UserContext() user
    // ) {
    //   return this.attendanceService.getPermission(
    //     id,
    //     CurrentUser.getActiveSubscription(user)
    //   );
    // }
}
