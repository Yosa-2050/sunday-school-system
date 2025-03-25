import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.reponse.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
import { Applicants } from './entities/applicants.entity';
import { JobApplication } from './entities/job-application.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

export class JobsService {
    constructor(
        private readonly profileService: ProfileService,
        private readonly jobPortalService: JobPortalService,
        @InjectRepository(Applicants)
        private applicantRepo: Repository<Applicants>,
        @InjectRepository(Applicants)
        private jobApplicantRepo: Repository<JobApplication>,
        @InjectRepository(JobApplication)
        private readonly jobApplication: Repository<JobApplication>,
    ) {}

    async getApplicantDetail(id: string) {
        const applicant = await this.applicantRepo.findOneBy({
            profile: { id },
        });
        const userDetails = new UserDetails();
        userDetails.applicantId = applicant?.id;
        userDetails.profileId = applicant?.profile?.id;
        return userDetails;
    }

    async apply(jobId: string, profileId: string) {
        let applicant = await this.applicantRepo.findOneBy({
            profile: { id: profileId },
        });
        if (!applicant) {
            applicant = await this.createApplicant(profileId);
        }

        const job = await this.jobPortalService.findOne(jobId);

        const application = this.jobApplicantRepo.create();
        application.job = job;
        application.applicants = applicant;

        return this.jobApplicantRepo.save(application);
    }
    async createApplicant(profileId: string) {
        const profile = await this.profileService.findById(profileId);

        const applicant = this.applicantRepo.create();
        applicant.profile = profile;

        return this.applicantRepo.save(applicant);
    }
}
