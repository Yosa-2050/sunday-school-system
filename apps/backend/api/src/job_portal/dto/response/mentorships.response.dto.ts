// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Programs } from '@shega/job_portal/entities/programs.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { CurrencyType } from '@shega/job_portal/enums/currency-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ExperienceLevelType } from '@shega/job_portal/enums/experiance-level-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SalaryType } from '@shega/job_portal/enums/salary-type.enum';

export class ProgramsResponseDto {
    constructor(
        program: Programs,
        appliedprograms: string[] = null,
        savedprograms: string[] = null,
    ) {
        this.id = program.id;
        this.createdDate = program.createdAt;
        this.postedDate = program.postedDate;
        this.status = program.status;
        this.title = program.title;
        this.description = program.description;
        this.isPublished = program.isPublished;
        this.applied = appliedprograms
            ? appliedprograms.includes(program.id)
            : false;
        this.saved = savedprograms ? savedprograms.includes(program.id) : false;
        this.experianceLevel = program.experianceLevel;
    }
    id: string;
    title: string;
    orgName: string;
    description: string;

    type: EmploymentType;

    salaryFrom: number;

    salaryTo: number;

    salaryType: SalaryType;

    status: ApprovalType;
    experianceLevel: ExperienceLevelType;
    isPublished: boolean;
    postedDate: Date;
    createdDate: Date;
    currency: CurrencyType;
    applied: boolean;
    saved: boolean;
}
