// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { Jobs } from '@shega/job_portal/entities/jobs.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';

export class JobResponseDto {
    constructor(job: Jobs) {
        this.salaryTo = job.salaryTo;
        this.createdDate = job.createdAt;
        this.postedDate = job.postedDate;
        this.salaryFrom = job.salaryFrom;
        this.status = job.status;
        this.type = job.type;
        this.title = job.title;
    }
    title: string;

    //description: string;

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

    //isPublished: boolean;

    postedDate: Date;

    //organization: Organization;

    //postedBy: EmployeeOrganization;

    createdDate: Date;
}
