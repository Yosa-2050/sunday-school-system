import { PaginationDto } from "@shega/Utilities/models/paginated.request";
import { IsEnum, IsOptional } from "class-validator";
import { UserRoleType } from "../enums/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";
import { OptionalEnum } from "@shega/Utilities/decorators/optional-uuid.decorator";

export class GetUsersByRoleDto extends PaginationDto {
 @ApiProperty({ enum: UserRoleType })
  @OptionalEnum(UserRoleType)

  role: UserRoleType;
}