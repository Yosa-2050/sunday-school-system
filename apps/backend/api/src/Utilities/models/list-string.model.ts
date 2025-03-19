import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ListStringRequestModel {
    @ApiProperty()
    @IsArray()
    list: string[];
}
