import { PartialType } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { NewProfileDto } from "./new-profile.dto";

export class UpdateProfileDto extends PartialType(NewProfileDto) {}
