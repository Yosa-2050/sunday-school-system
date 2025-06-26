import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityOperationNotAllowedException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notallowed.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { DateService } from '@shega/Utilities/date.service';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
// biome-ignore lint/style/useImportType: <explanation>
import { AddressService } from '@shega/location/address.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotesService } from '@shega/notification/notes.service';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from '@shega/organization/organization.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateBasicUserDto } from '@shega/users/dto/create-user.dto';
import { UserRoleType, UserRoleValue } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { QueryBuilderService } from 'shared/query-builder.service';
import { entityParamDeserializer, entityParamSerializer } from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { In, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import {
    CreateJobPortalDto,
    ProgramRequestDto,
} from './dto/request/create-job_portal.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobApplicationsRequestDto } from './dto/request/get-job-applications.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobsRequestDto } from './dto/request/get-jobs.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateJobPortalDto } from './dto/request/update-job_portal.dto';
import { JobApplicantsResponseDto } from './dto/response/job-applicants.response.dto';
import { JobResponseDto } from './dto/response/jobs.response.dto';
import { Applicants } from './entities/applicants.entity';
import { Category } from './entities/category.entity';
import { Applications } from './entities/job-application.entity';
import { ProgramCategory } from './entities/job-category.entity';
import { ProgramDescription } from './entities/job-description.entity';
import { ProgramSkills } from './entities/job-skills.entity';
import { Jobs } from './entities/jobs.entity';
import { Mentorship } from './entities/mentorship.entity';
import { Programs } from './entities/programs.entity';
import { SavedPrograms } from './entities/savedPrograms.entity';
import { Skills } from './entities/skills.entity';
import { ApplicationStatus } from './enums/job-application-status.enum';
import { ProgramType } from './enums/program-type.enum';
import { SalaryType } from './enums/salary-type.enum';

@Injectable()
export class JobPortalService {
    constructor(
        private organizationService: OrganizationService,
        @InjectRepository(ProgramSkills)
        private jobSkillsRepo: Repository<ProgramSkills>,
        @InjectRepository(ProgramCategory)
        private jobCategoryRepo: Repository<ProgramCategory>,
        @InjectRepository(ProgramDescription)
        private jobDescriptionRepo: Repository<ProgramDescription>,
        @InjectRepository(Jobs)
        private jobRepo: Repository<Jobs>,
        @InjectRepository(Programs)
        private programRepo: Repository<Programs>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        @InjectRepository(Skills)
        private skillRepo: Repository<Skills>,
        @InjectRepository(Applicants)
        private applicationRepo: Repository<Applicants>,
        @InjectRepository(Applications)
        private jobApplicationRepo: Repository<Applications>,
        @InjectRepository(SavedPrograms)
        private savedJobRepo: Repository<SavedPrograms>,
        @InjectRepository(Mentorship)
        private mentorshipRepo: Repository<Mentorship>,
        private readonly queryBuilderService: QueryBuilderService,
        private readonly addressService: AddressService,
        private readonly passwordService: PasswordService,
        private readonly profileService: ProfileService,
        private readonly notificationService: NotificationService,
        private readonly notesService: NotesService,
        private readonly dateService: DateService,
    ) {}

    async createJobSeeker(dto: CreateBasicUserDto) {
        const pwdGenerated = this.passwordService.generatePassword();

        const role = UserRoleType.JobSeeker;

        const user = await this.profileService.createNewUserProfileQDE(
            dto.email,
            role,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            false,
            pwdGenerated,
            true,
        );

        let applicants = this.applicationRepo.create();
        applicants.profile = user;

        applicants = await this.applicationRepo.save(applicants);

        const signupEmailTemplate = await this.notificationService.getTemplate(
            'signupEmailTemplate',
            {
                userName: dto.firstName,
                role: UserRoleValue(role).value,
                email: dto.email,
                tempPassword: pwdGenerated,
                loginUrl: UserRoleValue(role).url,
            },
            null,
        );

        if (applicants?.id) {
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: signupEmailTemplate.content,
                to: dto.email,
                subject: signupEmailTemplate.subject,
                reference: user.id,
            });
            return user;
        }

        throw new BadRequestException('Unable to create user');
    }

    async create(
        employeeOrgId: string,
        organizationId: string,
        dto: CreateJobPortalDto,
    ) {
        const organization =
            await this.organizationService.getOrganizationById(organizationId);

        if (organization.status !== ApprovalType.Approved) {
            throw new BadRequestException(
                'Organization is not approved, please contact your administrator',
            );
        }

        const employeeOrg = (await organization.employee).find(
            (x) => x.id === employeeOrgId,
        );
        const job = await this.GetJob(dto);
        const skills = this.GetSkills(dto);
        const descriptions = this.GetDescriptions(dto);

        const category = await this.GetCategories(dto);
        if (category?.length > 0) {
            job.program.jobCategory = category;
        }
        if (skills?.length > 0) {
            job.program.jobSkills = skills;
        }

        if (descriptions?.length > 0) {
            job.program.jobDescriptions = descriptions;
        }

        job.postedBy = employeeOrg;
        job.organization = organization;
        job.program.status = ApprovalType.Waiting_Approval;
        job.salaryTo =
            job.salaryType === SalaryType.Fixed ? job.salaryFrom : dto.salaryTo;
        const jobCreated = await this.jobRepo.save(job);
        return UtilityServices.EnsureCreated(jobCreated.id);
    }

    private async GetJob(dto: CreateJobPortalDto) {
        const job = this.jobRepo.create(dto);
        const program = await this.GetProgram(dto);
        program.programType = ProgramType.Job;
        job.program = program;

        return job;
    }

    public async GetProgram(dto: ProgramRequestDto) {
        const program = this.programRepo.create(dto);

        program.country = dto.countryId
            ? await this.addressService.findCountryById(dto.countryId)
            : null;
        program.state = dto.stateId
            ? await this.addressService.findLocationInfoById(dto.stateId)
            : null;
        program.city = dto.cityId
            ? await this.addressService.findLocationInfoById(dto.cityId)
            : null;
        return program;
    }

    public GetSkills(dto: ProgramRequestDto, program: Programs = null) {
        return dto.skills
            ?.map((skill) => {
                const jobSkill = this.jobSkillsRepo.create();
                jobSkill.skill = skill;
                if (program) {
                    jobSkill.program = program;
                }
                return jobSkill;
            })
            .filter((x) => x);
    }

    public GetDescriptions(dto: ProgramRequestDto, program: Programs = null) {
        return dto.jobDescriptions
            ?.map((desc) => {
                const jobDescription = this.jobDescriptionRepo.create();
                jobDescription.description = desc.description;
                jobDescription.type = desc.type;
                if (program) {
                    jobDescription.program = program;
                }
                return jobDescription;
            })
            .filter((x) => x);
    }

    public async GetCategories(
        dto: ProgramRequestDto,
        program: Programs = null,
    ) {
        const categories = await this.categoryRepo.find();

        const category = dto.catagories
            ?.map((category) => {
                const newCategory = categories.find((x) => x.id === category);
                if (!newCategory) {
                    return null;
                }
                const jobCategory = this.jobCategoryRepo.create();
                jobCategory.category = newCategory;
                if (program) {
                    jobCategory.program = program;
                }
                return jobCategory;
            })
            .filter((x) => x);
        return category;
    }

    async findOneForJobSeeker(id: string, applicantId: string) {
        const job = await this.findOneByJobId(id);
        if (!job) {
            throw new EntityNotFoundException('Job');
        }

        const appliedJobs = await this.programsApplied(applicantId);
        const jobsApplied = appliedJobs?.find(
            (x) => x.program.id === job.programId,
        );

        return { ...job, applied: !!jobsApplied };
    }

    async findOneMentorshipByProgramId(id: string) {
        const mentorship = await this.mentorshipRepo
            .createQueryBuilder('mentorship')
            .leftJoinAndSelect('mentorship.program', 'program')
            .leftJoinAndSelect('program.jobCategory', 'jobCategory')
            .leftJoinAndSelect('program.jobSkills', 'jobSkills')
            .leftJoinAndSelect('program.jobDescriptions', 'jobDescriptions')
            .leftJoinAndSelect('program.city', 'city')
            .leftJoinAndSelect('program.country', 'country')
            .leftJoinAndSelect('program.state', 'state')
            .leftJoinAndSelect('mentorship.mentor', 'mentor')
            .leftJoinAndSelect('mentor.profile', 'profile')
            .where('program.id = :id', { id })
            .getOne();

        if (!mentorship) {
            throw new EntityNotFoundException('Mentorship');
        }

        const { program, ...restOfMentorship } = mentorship;

        const flattened = {
            ...restOfMentorship,
            mentorshipId: mentorship?.id,
            programId: program?.id,
            ...(program ?? {}),
        };
        return flattened;
    }

    async findOneProgramForJobSeeker(id: string, applicantId: string) {
        const program = await this.programRepo.findOneBy({ id });
        if (!program) {
            throw new EntityNotFoundException('program');
        }

        const jobsApplied = await this.programRepo.findOneBy({
            applications: {
                applicants: { id: applicantId },
                program: { id: program.id },
            },
        });
        const savedJob = await this.savedJobRepo.findOneBy({
            program: { id: program.id },
            applicant: { id: applicantId },
        });

        const notes = await this.notesService.getNotesByReference(id);
        if (program.programType === ProgramType.Job) {
            const job = await this.findOneJobByProgramId(id);
            return {
                ...job,
                type: ProgramType.Job,
                applied: !!jobsApplied,
                saved: !!savedJob,
                notes: notes,
            };
        }

        if (program.programType === ProgramType.Mentorship) {
            const mentors = await this.findOneMentorshipByProgramId(id);
            return {
                ...mentors,
                type: ProgramType.Mentorship,
                applied: !!jobsApplied,
                saved: !!savedJob,
                notes: notes,
            };
        }
    }

    async filterJobs(filter: GetJobsRequestDto, applicantId: string = null) {
        const query = this.jobRepo.createQueryBuilder('job');
        query.leftJoinAndSelect('job.program', 'program');
        query.leftJoinAndSelect('job.organization', 'organization');
        query.orderBy('program.postedDate', 'DESC');
        query.andWhere('program.status = :status', {
            status: ApprovalType.Approved,
        });
        query.andWhere('program.isPublished = :isPublished', {
            isPublished: true,
        });

        if (filter.title) {
            query.andWhere('LOWER(program.title) LIKE LOWER(:title)', {
                title: `%${filter.title}%`,
            });
        }

        if (filter.categoryId) {
            query
                .leftJoin('program.jobCategory', 'category')
                .andWhere('category.id = :categoryId', {
                    categoryId: filter.categoryId,
                });
        }

        if (filter.type) {
            query.andWhere('job.type = :employmentType', {
                employmentType: filter.type,
            });
        }

        if (filter.experianceLevel) {
            query.andWhere('program.experianceLevel = :experianceLevel', {
                experianceLevel: filter.experianceLevel,
            });
        }

        if (filter.salaryFrom) {
            query.andWhere('job.salaryFrom >= :salaryFrom', {
                salaryFrom: filter.salaryFrom,
            });
        }

        if (filter.salaryTo) {
            query.andWhere('job.salaryTo <= :salaryTo', {
                salaryTo: filter.salaryTo,
            });
        }

        if (filter.organizationId) {
            query.andWhere('job.organizationId = :organizationId', {
                organizationId: filter.organizationId,
            });
        }

        if (filter.countryId) {
            query.andWhere('program.countryId = :countryId', {
                countryId: filter.countryId,
            });
        }

        if (filter.cityId) {
            query.andWhere('program.cityId = :cityId', {
                cityId: filter.cityId,
            });
        }

        let jobsApplied: string[] = null;
        if (applicantId) {
            const appliedJobs = await this.programsApplied(applicantId);
            jobsApplied = appliedJobs.map((x) => x.program?.id);
        }

        let savedJobs: string[] = null;
        if (applicantId) {
            const jobs = await this.savedPrograms(applicantId);
            savedJobs = jobs.map((x) => x.program?.id);
        }
        //const queryStr = query.getSql();
        const [data, total] = await query
            .skip((filter.pagination.page - 1) * filter.pagination.limit)
            .take(filter.pagination.limit)
            .getManyAndCount();
        const jobsList = data.map(
            (job) => new JobResponseDto(job, jobsApplied, savedJobs),
        );
        return new PaginatedResponseDto<JobResponseDto[]>(
            jobsList,
            total,
            filter.pagination.page,
            filter.pagination.limit,
        );
    }

    async getJobsByStatusPaginated(
        paginationDto: string,
        applicantId: string = null,
        exportList = false,
    ) {
        let { p, pp } = entityParamDeserializer(paginationDto);
        if (exportList) {
            p = 0;
            pp = 0;
        }
        const deserialized = entityParamDeserializer(paginationDto);
        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                { f: 'program.isPublished', v: 'true', o: 'eq' },
                ...(deserialized.f ?? []),
            ],
        });

        const joinOptions = [
            {
                relation: 'entity.organization',
                alias: 'organization',
            },
            {
                relation: 'entity.postedBy',
                alias: 'postedBy',
            },
            {
                relation: 'entity.program',
                alias: 'program',
            },
        ];

        const searchableColumns = [
            'program.title',
            'program.description',
            'organization.name',
        ];

        const { data: jobs, total } = await this.queryBuilderService.buildQuery(
            this.jobRepo,
            queryString,
            joinOptions,
            searchableColumns,
        );
        let jobsApplied: string[] = null;
        if (applicantId) {
            const appliedJobs = await this.programsApplied(applicantId);
            jobsApplied = appliedJobs.map((x) => x.program.id);
        }
        const jobsList = jobs.map(
            (job) => new JobResponseDto(job, jobsApplied),
        );
        return new PaginatedResponseDto<JobResponseDto[]>(
            jobsList,
            total,
            p,
            pp,
        );
    }

    async programsApplied(id: string) {
        const existingApp = await this.jobApplicationRepo.findBy({
            applicants: { id },
        });

        return existingApp;
    }

    async savedPrograms(id: string) {
        const existingApp = await this.savedJobRepo.findBy({
            applicant: { id },
        });

        return existingApp;
    }

    async getJobsByStatusAndByOrgPaginated(
        organizationId: string,
        paginationDto: string,
        isOnlyDraft?: boolean,
        isOnlyPublished?: boolean,
    ) {
        const deserialized = entityParamDeserializer(paginationDto);

        const searchableColumns = [
            'program.title',
            'program.description',
            'organization.name',
        ];

        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                { f: 'organization.id', v: organizationId, o: 'eq' }, // Uncommented filter
                isOnlyDraft
                    ? { f: 'program.isPublished', v: 'false', o: 'eq' }
                    : {},
                isOnlyPublished
                    ? {
                          f: 'program.isPublished',
                          v: isOnlyPublished.toString(),
                          o: 'eq',
                      }
                    : {},
                ...(deserialized.f ?? []),
            ],
        });

        const joinOptions = [
            {
                relation: 'entity.organization',
                alias: 'organization',
            },
            {
                relation: 'entity.postedBy',
                alias: 'postedBy',
            },
            {
                relation: 'entity.program',
                alias: 'program',
            },
        ];

        const { data: jobs, total } = await this.queryBuilderService.buildQuery(
            this.jobRepo,
            queryString,
            joinOptions,
            searchableColumns,
        );

        const jobsList = jobs.map((org) => new JobResponseDto(org));

        return new PaginatedResponseDto<JobResponseDto[]>(
            jobsList,
            total,
            deserialized.p,
            deserialized.pp,
        );
    }

    async getJobsByList(list: string[]) {
        const jobs = await this.jobRepo.find({ where: { id: In(list) } });

        const jobsList = jobs.map((org) => new JobResponseDto(org));

        return jobsList;
    }

    async programApproval(id: string, status: ApprovalType, note = '') {
        const program = await this.programRepo.findOneBy({ id });
        if (!program) {
            throw new EntityNotFoundException('program');
        }
        if (!program?.isPublished) {
            throw new ForbiddenException('Program is not published');
        }
        if (program?.status !== ApprovalType.Waiting_Approval) {
            throw new EntityOperationNotAllowedException('Program', 'Approve');
        }
        const updatedJob = await this.programRepo.update(id, {
            status,
            postedDate:
                status === ApprovalType.Approved
                    ? this.dateService.getCurrentDate()
                    : null,
        });

        if (note) {
            await this.notesService.create(id, note, 'Program approved');
        }

        const result = UtilityServices.EnsureUpdated(updatedJob, id);
        const job = await this.jobRepo.findOneBy({ program: { id } });
        if (job) {
            await this.SendJobApprovedNotification(
                job,
                result.success,
                status,
                note,
            );
        }

        return result;
    }

    private async SendJobApprovedNotification(
        job: Jobs,
        result: boolean,
        status: ApprovalType,
        note: string,
    ) {
        if (result) {
            let emailTemplate = null;

            if (status === ApprovalType.Approved) {
                emailTemplate = await this.notificationService.getTemplate(
                    'jobPostApprovedEmailTemplate',
                    {
                        employerName: job.postedBy.employee.profile.firstName,
                        jobTitle: job.program.title,
                        organizationName: job.organization.name,
                    },
                    {
                        jobTitle: job.program.title,
                    },
                );
            }

            if (status === ApprovalType.Declined) {
                emailTemplate = await this.notificationService.getTemplate(
                    'jobPostDeclinedEmailTemplate',
                    {
                        employerName: job.postedBy.employee.profile.firstName,
                        jobTitle: job.program.title,
                        organizationName: job.organization.name,
                        reasonForDecline: note,
                    },
                    {
                        jobTitle: job.program.title,
                    },
                );
            }
            const user = await this.profileService.findUserByProfileId(
                job.postedBy.employee.profile.id,
            );

            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: emailTemplate.content,
                to: user.email,
                subject: emailTemplate.subject,
                reference: user.id,
            });
        }
    }

    findAll() {
        throw new NotImplementedException();
    }
    findOneByJobIdRepo(id: string) {
        return this.programRepo.findOneBy({ id });
    }
    async findOneByJobId(id: string) {
        const job = await this.jobRepo
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.program', 'program')
            .innerJoinAndSelect('program.jobCategory', 'jobCategory')
            .leftJoinAndSelect('program.jobSkills', 'jobSkills')
            .leftJoinAndSelect('program.jobDescriptions', 'jobDescriptions')
            .leftJoinAndSelect('program.city', 'city')
            .leftJoinAndSelect('program.country', 'country')
            .leftJoinAndSelect('program.state', 'state')
            .leftJoinAndSelect('job.organization', 'organization')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('postedBy.employee', 'employee')
            .leftJoinAndSelect('employee.profile', 'profile')
            .innerJoinAndSelect('jobCategory.category', 'category')
            .where('job.id = :id', { id })
            .getOne();
        if (!job) {
            throw new EntityNotFoundException('Job');
        }

        const { program, ...restOfJob } = job;

        const flattenedJob = {
            ...restOfJob,
            jobId: job?.id,
            programId: program?.id,
            ...(program ?? {}),
        };
        return flattenedJob;
    }

    async findOneJobByProgramId(id: string) {
        const job = await this.jobRepo
            .createQueryBuilder('job')
            .leftJoinAndSelect('job.program', 'program')
            .innerJoinAndSelect('program.jobCategory', 'jobCategory')
            .leftJoinAndSelect('program.jobSkills', 'jobSkills')
            .leftJoinAndSelect('program.jobDescriptions', 'jobDescriptions')
            .leftJoinAndSelect('program.city', 'city')
            .leftJoinAndSelect('program.country', 'country')
            .leftJoinAndSelect('program.state', 'state')
            .leftJoinAndSelect('job.organization', 'organization')
            .leftJoinAndSelect('job.postedBy', 'postedBy')
            .leftJoinAndSelect('postedBy.employee', 'employee')
            .leftJoinAndSelect('employee.profile', 'profile')
            .innerJoinAndSelect('jobCategory.category', 'category')
            .where('program.id = :id', { id })
            .getOne();
        if (!job) {
            throw new EntityNotFoundException('Job');
        }

        const { program, ...restOfJob } = job;

        const flattenedJob = {
            ...restOfJob,
            jobId: job?.id,
            programId: program?.id,
            ...(program ?? {}),
        };
        return flattenedJob;
    }

    findOneProgram(id: string) {
        return this.programRepo.findOneBy({ id });
    }

    findJobByProgram(id: string) {
        return this.jobRepo.findOneBy({ program: { id } });
    }

    findMentorshipByProgram(id: string) {
        return this.jobRepo.findOneBy({ program: { id } });
    }

    async update(id: string, dto: UpdateJobPortalDto, organizationId: string) {
        const job = await this.jobRepo.findOneBy({
            id,
            organization: { id: organizationId },
        });

        if (!job) {
            throw new EntityNotFoundException('Job not found');
        }

        const createDto: CreateJobPortalDto = {
            ...dto,
            title: dto.title ?? job.program.title,
            isPublished: dto.isPublished ?? job.program.isPublished,
        };
        const updateJob = await this.GetJob(createDto);
        const skills = await this.GetSkills(createDto, job.program);
        if (skills && skills.length > 0) {
            await this.jobSkillsRepo.delete({
                program: { id: job.program.id },
            });
            await this.jobSkillsRepo.save(skills);
        }

        const categories = await this.GetCategories(createDto, job.program);
        if (categories && categories.length > 0) {
            await this.jobCategoryRepo.delete({
                program: { id: job.program.id },
            });
            await this.jobCategoryRepo.save(categories);
        }

        const description = await this.GetDescriptions(createDto, job.program);
        if (description && description.length > 0) {
            await this.jobDescriptionRepo.delete({
                program: { id: job.program.id },
            });
            await this.jobDescriptionRepo.save(description);
        }
        const { program, ...jobDetail } = updateJob;
        program.jobDescriptions = undefined;
        const updatedProg = await this.programRepo.update(
            job.program.id,
            program,
        );
        const updated = await this.jobRepo.update(id, jobDetail);
        updateJob.salaryTo =
            updateJob.salaryType === SalaryType.Fixed
                ? updateJob.salaryFrom
                : updateJob.salaryTo;

        return UtilityServices.EnsureMultipleUpdated(updated, updatedProg, id);
    }

    async remove(id: string) {
        const job = await this.jobRepo.findOneBy({ id });

        if (!job) {
            throw new EntityNotFoundException('Job not found');
        }

        return this.jobRepo.softDelete(id);
    }

    async getCategoriesByParentId(id: string) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new EntityNotFoundException('Category');
        }

        return category.childs;
    }

    async createSkills(name: string) {
        const skillExisting = await this.skillRepo.findOneBy({
            name,
            isActive: true,
        });
        if (skillExisting) {
            throw new BadRequestException('Skill found with the name');
        }

        const skill = this.skillRepo.create();
        skill.name = name;

        return this.skillRepo.save(skill);
    }
    async createCategories(name: string) {
        const categoryExisting = await this.categoryRepo.findOneBy({
            name,
            isActive: true,
        });
        if (categoryExisting) {
            throw new BadRequestException('Category found with the name');
        }

        const category = this.categoryRepo.create();
        category.name = name;
        category.isRoot = true;
        category.hasChild = true;
        return this.categoryRepo.save(category);
    }

    async addCategoriesByParentId(id: string, name: string) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new EntityNotFoundException('Category');
        }

        const childCategory = this.categoryRepo.create();
        childCategory.name = name;
        childCategory.isRoot = false;
        childCategory.hasChild = false;
        childCategory.parent = category;
        return this.categoryRepo.save(childCategory);
    }

    findSkills() {
        return this.skillRepo.find();
    }
    findCategories() {
        return this.categoryRepo.findBy({ isRoot: true });
    }

    findCategoryById(id: string) {
        return this.categoryRepo.findOneBy({ id });
    }

    async deleteSkills(id: string) {
        const deleted = await this.skillRepo.delete(id);

        return UtilityServices.EnsureDeleted(deleted, id);
    }
    async deleteCategories(id: string) {
        const deleted = await this.skillRepo.delete(id);

        return UtilityServices.EnsureDeleted(deleted, id);
    }
    async updateSkills(id: string, name: string) {
        const update = await this.skillRepo.preload({
            id,
            name,
        });
        if (!update) {
            throw new EntityNotFoundException('Skill');
        }
        return this.skillRepo.save(update);
    }
    async updateCategories(id: string, name: string) {
        const update = await this.categoryRepo.preload({
            id,
            name,
        });
        if (!update) {
            throw new EntityNotFoundException('Category');
        }
        return this.categoryRepo.save(update);
    }

    async shortlistApplicants(
        programId: string,
        applications: string[],
        organizationId: string,
        mentorId: string,
    ) {
        this.validateProgramIdOnUser(programId, organizationId, mentorId);

        const result = await this.jobApplicationRepo.update(
            {
                id: In(applications),
                program: { id: programId },
            },
            { status: ApplicationStatus.SHORT_LISTED },
        );

        return UtilityServices.EnsureUpdated(result, programId);
    }

    async rejectNotShortlisted(
        programId: string,
        organizationId: string,
        mentorId: string,
    ) {
        this.validateProgramIdOnUser(programId, organizationId, mentorId);

        const result = await this.jobApplicationRepo.update(
            {
                status: ApplicationStatus.PENDING,
                program: { id: programId },
            },
            { status: ApplicationStatus.REJECTED },
        );

        return UtilityServices.EnsureUpdated(result, programId);
    }

    async validateProgramIdOnUser(
        programId: string,
        organizationId: string,
        mentorId: string,
    ) {
        const program = await this.programRepo.findOneBy({ id: programId });
        if (!program) {
            throw new EntityNotFoundException('Program', programId);
        }

        if (program.programType === ProgramType.Job) {
            const job = await this.jobRepo.findOneBy({
                program: { id: program.id },
                organization: { id: organizationId },
            });
            if (!job) {
                throw new ForbiddenException('Unable to access program');
            }
        } else if (program.programType === ProgramType.Mentorship) {
            const mentorship = await this.mentorshipRepo.findOneBy({
                program: { id: program.id },
                mentor: { id: mentorId },
            });
            if (!mentorship) {
                throw new ForbiddenException('Unable to access program');
            }
        } else {
            throw new BadRequestException('Unknown program type');
        }

        return true;
    }

    async jobsAppliedByJobId(
        programId: string,
        request: GetJobApplicationsRequestDto,
    ) {
        const query = this.jobApplicationRepo
            .createQueryBuilder('applications')
            .leftJoinAndSelect('applications.program', 'program')
            .leftJoinAndSelect('applications.applicants', 'applicants')
            .leftJoinAndSelect('applicants.profile', 'profile')
            .skip((request.pagination.page - 1) * request.pagination.limit)
            .take(request.pagination.limit)
            .orderBy('applications.createdAt', 'DESC');

        query.andWhere('program.id = :programId', { programId });

        if (request.status) {
            query.andWhere('applications.status = :status', {
                status: request.status,
            });
        }

        if (request.ageTo || request.ageFrom) {
            const currentDate = this.dateService.getCurrentDate();

            // Calculate date range based on age
            const fromDate = new Date(
                currentDate.getFullYear() - (request.ageTo ?? 100),
                currentDate.getMonth(),
                currentDate.getDate(),
            );

            const toDate = new Date(
                currentDate.getFullYear() - (request.ageFrom ?? 0),
                currentDate.getMonth(),
                currentDate.getDate(),
            );

            query.andWhere('profile.birthDate BETWEEN :fromDate AND :toDate', {
                fromDate: fromDate.toISOString().split('T')[0], // 'YYYY-MM-DD'
                toDate: toDate.toISOString().split('T')[0],
            });
        }

        if (request.gender) {
            query.andWhere('profile.gender = :gender', {
                gender: request.gender,
            });
        }

        if (request.category) {
            query.andWhere(
                `EXISTS (
                  SELECT 1 FROM educational_history edu
                  WHERE edu.application_id = applications.id
                    AND edu.field_of_study = :category
                )`,
                { category: request.category },
            );
        }

        if (request.pagination.search) {
            query.andWhere(
                `LOWER(CONCAT(profile.firstName, ' ', profile.lastName)) LIKE :search`,
                { search: `%${request.pagination.search.toLowerCase()}%` },
            );
        }

        const [data, total] = await query.getManyAndCount();

        const applicants = data.map((app) => new JobApplicantsResponseDto(app));
        return new PaginatedResponseDto<JobApplicantsResponseDto[]>(
            applicants,
            total,
            request.pagination.page,
            request.pagination.limit,
        );
    }
}
