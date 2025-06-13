// biome-ignore lint/style/useImportType: <explanation>
import { Applications } from '@shega/job_portal/entities/job-application.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ApplicationStatus } from '@shega/job_portal/enums/job-application-status.enum';

export class JobApplicantsResponseDto {
    constructor(res: Applications) {
        this.firstName = res.applicants.profile.firstName;
        this.lastName = res.applicants.profile.lastName;
        this.middleName = res.applicants.profile.middleName;
        this.applicantId = res.applicants.id;
        this.profileId = res.applicants.profile.id;
        this.dateOfApplicaton = res.createdAt;
        this.applicationStatus = res.status;
    }
    applicantId: string;
    profileId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfApplicaton: Date;
    applicationStatus: ApplicationStatus;
}
