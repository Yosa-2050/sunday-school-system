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
import { BadRequestException } from '@nestjs/common';

export class JobsService {
    constructor(
        private readonly profileService: ProfileService,
        private readonly jobPortalService: JobPortalService,
        @InjectRepository(Applicants)
        private applicantRepo: Repository<Applicants>,
        @InjectRepository(JobApplication)
        private jobApplicantRepo: Repository<JobApplication>,
        @InjectRepository(JobApplication)
        private readonly jobApplication: Repository<JobApplication>,
    ) {}

    async getApplicantDetail(id: string) {
        const applicant = await this.applicantRepo.findOneBy({
            profile: { id },
        });

        const profile = await this.profileService.findById(id);
        const userDetails = new UserDetails();
        userDetails.applicantId = applicant?.id;
        userDetails.profileId = profile?.id;
        return userDetails;
    }

    async apply(jobId: string, profileId: string) {
        let applicant = await this.applicantRepo.findOneBy({
            profile: { id: profileId },
        });
        if (!applicant) {
            applicant = await this.createApplicant(profileId);
        }
        const existingApp = await this.jobApplicantRepo.findOneBy({
            job: { id: jobId },
            applicants: { id: applicant.id },
        });
        if (existingApp) {
            throw new BadRequestException('Already applied for the job');
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

    async jobsApplied(id: string) {
        const existingApp = await this.jobApplicantRepo.findOneBy({
            applicants: { profile: { id } },
        });
        if (!existingApp) {
            throw new BadRequestException('No applied jobs');
        }

        return existingApp;
    }

    async jobsAppliedByJobId(id: string) {
        const existingApp = await this.jobApplicantRepo.findOneBy({
            job: { id },
        });
        if (!existingApp) {
            throw new BadRequestException('No applied jobs');
        }

        return existingApp;
    }
}
