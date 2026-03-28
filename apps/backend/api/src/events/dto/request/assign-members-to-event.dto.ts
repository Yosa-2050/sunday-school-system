import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class AssignMembersToEventDto {

  @ApiProperty()
  @IsArray()
  @IsUUID("all", { each: true })
  memberIds: string[];
}