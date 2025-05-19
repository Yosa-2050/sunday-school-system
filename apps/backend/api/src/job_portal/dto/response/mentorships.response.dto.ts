// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Mentorship } from '@shega/job_portal/entities/mentorship.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { CurrencyType } from '@shega/job_portal/enums/currency-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ExperianceLevelType } from '@shega/job_portal/enums/experiance-level-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SalaryType } from '@shega/job_portal/enums/salary-type.enum';

export class MentorshipsResponseDto {
    constructor(mentorships: Mentorship, appliedprograms: string[] = null) {
        this.id = mentorships.id;
        this.createdDate = mentorships.createdAt;
        this.postedDate = mentorships.program.postedDate;
        this.status = mentorships.program.status;
        this.title = mentorships.program.title;
        this.description = mentorships.program.description;
        this.note = mentorships.program.notes;
        this.isPublished = mentorships.program.isPublished;
        this.applied = appliedprograms ? appliedprograms.includes(mentorships.id) : false;
        this.programId = mentorships.program.id;
        this.experianceLevel = mentorships.program.experianceLevel;
    }
    id: string;
    programId: string;
    title: string;
    orgName: string;
    description: string;

    type: EmploymentType;

    salaryFrom: number;

    salaryTo: number;

    salaryType: SalaryType;

    status: ApprovalType;
    experianceLevel: ExperianceLevelType;
    isPublished: boolean;
    postedDate: Date;
    createdDate: Date;
    note: string;
    currency: CurrencyType;
    applied: boolean;
}
