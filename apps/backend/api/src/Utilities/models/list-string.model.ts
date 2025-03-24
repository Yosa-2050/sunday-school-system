import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ListStringRequestModel {
    @ApiProperty()
    @IsArray()
    list: string[];

    @ApiProperty()
    q: string;
}

export class StringRequestModel {
    @ApiProperty()
    @IsString()
    note: string;
}
