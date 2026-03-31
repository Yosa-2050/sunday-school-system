import { ApiProperty } from "@nestjs/swagger";

export class EventAttendanceResponseDto {
  @ApiProperty()
  memberId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty({ required: false })
  middleName?: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty()
  present: number;

  @ApiProperty()
  absent: number;

  @ApiProperty()
  late: number;

  @ApiProperty()
  permission: number;

  @ApiProperty()
  total: number;
}
