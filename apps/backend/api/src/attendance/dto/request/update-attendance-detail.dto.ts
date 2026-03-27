import { PartialType } from '@nestjs/swagger';
import { AttendanceDetailDto } from './create-attendance-detail.dto';

export class UpdateAttendanceDetailDto extends PartialType(
    AttendanceDetailDto,
) {}
