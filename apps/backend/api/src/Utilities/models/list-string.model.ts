import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ListStringRequestModel {
    @ApiProperty()
    @IsArray()
    list: string[];
}

export class ExportWithQuesryRequestModel extends ListStringRequestModel {

    @ApiProperty()
    @IsString()
    @IsOptional()
    q: string;
}

export class StringRequestModel {
    @ApiProperty()
    @IsString()
    note: string;
}
