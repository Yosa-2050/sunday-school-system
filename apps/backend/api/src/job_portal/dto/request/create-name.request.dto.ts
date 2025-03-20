import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUsingNameRequestDto{
    @ApiProperty()
    @IsString()
    name: string;
}