import { ApiProperty } from "@nestjs/swagger";
import { Profile } from "@shega/users/entities/profile.entity";
import { ManyToOne } from "typeorm";

export class EventMemberResponseDto {

  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  attendanceStatus?: string;
}
