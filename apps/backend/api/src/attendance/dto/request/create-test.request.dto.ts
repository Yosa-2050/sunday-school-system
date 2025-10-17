import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class TestRequestDto {
    @ApiProperty()
    @OptionalUUID()
    subjectId: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    weight: number;

    @ApiProperty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsString()
    documentId: string;

    @ApiProperty()
    @IsBoolean()
    isGroupAssignment: boolean;
}
