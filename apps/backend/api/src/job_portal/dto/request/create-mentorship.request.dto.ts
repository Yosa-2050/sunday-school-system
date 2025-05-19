import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { OptionalEnum } from '@shega/Utilities/decorators/optional-uuid.decorator';
import { CommitmentType } from '@shega/job_portal/enums/commitment-type.enum';
import { ExperianceLevelType } from '@shega/job_portal/enums/experiance-level-type.enum';
import { MentorshipType } from '@shega/job_portal/enums/mentorship-type.enum';
import { IsNumber, IsOptional } from 'class-validator';
import { ProgramRequestDto } from './create-job_portal.dto';

export class CreateMentorShipProgramRequestDto extends ProgramRequestDto {
    @ApiProperty({
        example: MentorshipType.Group,
        description: 'Group mentorship',
    })
    @OptionalEnum(MentorshipType)
    mentorshipType: MentorshipType;

    @ApiProperty({
        example: CommitmentType.HoursPerDay,
        description: 'Hours per day',
    })
    @OptionalEnum(CommitmentType)
    commitment: CommitmentType;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    duration: number;

    @ApiProperty({
        example: ExperianceLevelType.Entry,
        description: 'Enty level',
    })
    @OptionalEnum(ExperianceLevelType)
    audience: ExperianceLevelType;
}
