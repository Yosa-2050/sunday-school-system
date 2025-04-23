// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Jobs } from '@shega/job_portal/entities/jobs.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { CurrencyType } from '@shega/job_portal/enums/currency-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';

export class JobResponseDto {
    constructor(job: Jobs, appliedJobs: string[] = null) {
        this.id = job.id;
        this.salaryTo = job.salaryTo;
        this.createdDate = job.createdAt;
        this.postedDate = job.postedDate;
        this.salaryFrom = job.salaryFrom;
        this.status = job.status;
        this.type = job.type;
        this.title = job.title;
        this.orgName = job.organization?.name;
        this.description = job.description;
        this.note = job.notes;
        this.currency = job.currency;
        this.isPublished = job.isPublished;
        this.applied = appliedJobs ? appliedJobs.includes(job.id) : false;
    }
    id: string;
    title: string;
    orgName: string;
    description: string;

    type: EmploymentType;

    salaryFrom: number;

    salaryTo: number;

    //salaryType: SalaryType; //fixed, negotiable

    //salaryFrequency: SalaryFrequencyType;

    status: ApprovalType;

    //workPlace: WorkPlaceType;

    //country: Country;

    //state: LocationInfo;

    //city: LocationInfo;

    //experianceLevel: ExperianceLevelType;

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
    note: string;
    currency: CurrencyType;
    applied: boolean;
}
