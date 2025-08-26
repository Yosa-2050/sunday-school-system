import { ApiProperty } from '@nestjs/swagger';
import { OptionalUUID } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { IsDateString, IsString } from 'class-validator';

export class CreateCalendarYearRequestDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsDateString()
    startDate: Date;

    @ApiProperty()
    @IsDateString()
    endDate: Date;

    @ApiProperty()
    @OptionalUUID()
    programId: string;
}
