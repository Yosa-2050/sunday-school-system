import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { CommitmentType } from '@shega/job_portal/enums/commitment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ExperianceLevelType } from '@shega/job_portal/enums/experiance-level-type.enum';
import { MentorshipType } from '@shega/job_portal/enums/mentorship-type.enum';
import { IsNumber, IsOptional } from 'class-validator';
import { ProgramRequestDto } from './create-job_portal.dto';

export class CreateMentorShipProgramRequestDto extends ProgramRequestDto {
    @ApiProperty()
    @OptionalEnum(MentorshipType)
    mentorshipType: MentorshipType;

    @ApiProperty()
    @OptionalEnum(MentorshipType)
    commitment: CommitmentType;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    duration: number;

    @ApiProperty()
    @OptionalEnum(MentorshipType)
    audience: ExperianceLevelType;
}
