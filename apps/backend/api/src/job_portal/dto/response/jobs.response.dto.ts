// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Jobs } from '@shega/job_portal/entities/jobs.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { CurrencyType } from '@shega/job_portal/enums/currency-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ExperienceLevelType } from '@shega/job_portal/enums/experience-level-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { SalaryType } from '@shega/job_portal/enums/salary-type.enum';

export class JobResponseDto {
    constructor(
        job: Jobs,
        appliedJobs: string[] = null,
        savedJobs: string[] = null,
    ) {
        this.id = job.id;
        this.salaryTo = job.salaryTo;
        this.createdDate = job.createdAt;
        this.postedDate = job.program.postedDate;
        this.salaryFrom = job.salaryFrom;
        this.status = job.program.status;
        this.type = job.type;
        this.title = job.program.title;
        this.orgName = job.organization?.name;
        this.description = job.program.description;
        this.currency = job.currency;
        this.isPublished = job.program.isPublished;
        this.applied = appliedJobs ? appliedJobs.includes(job.id) : false;
        this.saved = savedJobs ? savedJobs.includes(job.id) : false;
        this.salaryType = job.salaryType;
        this.programId = job.program.id;
        this.experianceLevel = job.program.experianceLevel;
        this.isClosed = job.program.isClosed;
        this.isExpired = job.program.isExpired;
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

    //salaryFrequency: SalaryFrequencyType;

    status: ApprovalType;

    //workPlace: WorkPlaceType;

    //country: Country;

    //state: LocationInfo;

    //city: LocationInfo;

    experianceLevel: ExperienceLevelType;

    //experiance: number;

    //deadline: Date;

    //educationalRequirment: EducationalRequirmentType;

    //jobSkills: JobSkills[];

    ///jobCategory: JobCategory[];

    isPublished: boolean;

    postedDate: Date;

    //organization: Organization;

    //postedBy: EmployeeOrganization;

    createdDate: Date;
    currency: CurrencyType;
    applied: boolean;
    saved: boolean;
    isClosed: boolean;
    isExpired: boolean;
}
