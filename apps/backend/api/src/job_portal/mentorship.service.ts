import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.response.dto';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationType } from '@shega/notification/enums/notification-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateBasicUserDto } from '@shega/users/dto/create-user.dto';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType, UserRoleValue } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from '@shega/users/users.service';
// biome-ignore lint/style/useImportType: <explanation>
import { QueryBuilderService } from 'shared/query-builder.service';
// biome-ignore lint/style/useImportType: <explanation>
import {
    EntityParam,
    entityParamDeserializer,
    entityParamSerializer,
} from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateMentorShipProgramRequestDto } from './dto/request/create-mentorship.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetJobsRequestDto } from './dto/request/get-jobs.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateMentorShipProgramDto } from './dto/request/update-mentorship-program.request.dto';
import { ProgramsResponseDto } from './dto/response/mentorships.response.dto';
import { ProgramCategory } from './entities/job-category.entity';
import { ProgramDescription } from './entities/job-description.entity';
import { ProgramSkills } from './entities/job-skills.entity';
import { Mentors } from './entities/mentor.entity';
import { Mentorship } from './entities/mentorship.entity';
import { Programs } from './entities/programs.entity';
import { ProgramType } from './enums/program-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

@Injectable()
export class MentorshipService {
    constructor(
        @InjectRepository(Mentors)
        private mentorsRepo: Repository<Mentors>,
        @InjectRepository(Programs)
        private programRepo: Repository<Programs>,
        @InjectRepository(Mentorship)
        private mentorshipRepo: Repository<Mentorship>,
        private jobPortalService: JobPortalService,
        private passwordService: PasswordService,
        private profileService: ProfileService,
        private notificationService: NotificationService,
        private queryBuilderService: QueryBuilderService,
        private userService: UsersService,
        @InjectRepository(ProgramSkills)
        private programSkillsRepo: Repository<ProgramSkills>,
        @InjectRepository(ProgramCategory)
        private programCategoryRepo: Repository<ProgramCategory>,
        @InjectRepository(ProgramDescription)
        private programDescriptionRepo: Repository<ProgramDescription>,
    ) {}

    async createMentor(dto: CreateBasicUserDto) {
        const pwdGenerated = this.passwordService.generatePassword();

        const role = UserRoleType.Mentor;

        const user = await this.profileService.createNewUserProfileQDE(
            dto.email,
            LoginBy.EMAIL,
            role,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            '',
            false,
            pwdGenerated,
            true,
        );

        let mentor = this.mentorsRepo.create();
        mentor.profile = user;
        mentor.status = ApprovalType.New;

        mentor = await this.mentorsRepo.save(mentor);

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

        if (mentor?.id) {
            const metaData = {
                mentorId: mentor.id,
            };
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: signupEmailTemplate.content,
                to: dto.email,
                subject: signupEmailTemplate.subject,
                reference: user.id,
                type: NotificationType.Mentor,
                metaData,
            });
            return user;
        }

        throw new BadRequestException('Unable to create user');
    }

    async create(mentorId: string, dto: CreateMentorShipProgramRequestDto) {
        const mentor = await this.mentorsRepo.findOneBy({ id: mentorId });

        //TODO: Removed until further notice
        // if (mentor?.status !== ApprovalType.Approved) {
        //     throw new BadRequestException(
        //         'Mentor is not approved, please contact your administrator',
        //     );
        // }

        const mentorShip = await this.GetMentorship(dto);
        const skills = this.jobPortalService.GetSkills(dto);
        const descriptions = this.jobPortalService.GetDescriptions(dto);

        const category = await this.jobPortalService.GetCategories(dto);
        if (category?.length > 0) {
            mentorShip.program.jobCategory = category;
        }
        if (skills?.length > 0) {
            mentorShip.program.jobSkills = skills;
        }

        if (descriptions?.length > 0) {
            mentorShip.program.jobDescriptions = descriptions;
        }

        mentorShip.program.status = ApprovalType.Waiting_Approval;
        mentorShip.mentor = mentor;
        const mentorshipRepoCreated =
            await this.mentorshipRepo.save(mentorShip);
        const created = UtilityServices.EnsureCreated(mentorshipRepoCreated.id);
        if (created.success) {
            await this.SendNotificationForJobCreatedToAdmin(
                mentorshipRepoCreated,
            );
        }

        return created;
    }

    async update(
        mentorShipId: string,
        dto: UpdateMentorShipProgramDto,
        mentorId: string,
    ) {
        const mentorShip = await this.mentorshipRepo.findOneBy({
            id: mentorShipId,
            mentor: { id: mentorId },
        });

        if (!mentorShip) {
            throw new EntityNotFoundException('Mentorship not found');
        }

        const createDto: CreateMentorShipProgramRequestDto = {
            ...dto,
            title: dto.title ?? mentorShip.program.title,
            isPublished: dto.isPublished ?? mentorShip.program.isPublished,
        };

        const updatedMentorShip = await this.GetMentorship(createDto);
        const skills = this.jobPortalService.GetSkills(
            createDto,
            mentorShip.program,
        );
        const description = this.jobPortalService.GetDescriptions(
            createDto,
            mentorShip.program,
        );

        const categories = await this.jobPortalService.GetCategories(
            createDto,
            mentorShip.program,
        );
        if (skills && skills.length > 0) {
            await this.programSkillsRepo.delete({
                program: { id: mentorShip.program.id },
            });
            await this.programSkillsRepo.save(skills);
        }

        if (categories && categories.length > 0) {
            await this.programCategoryRepo.delete({
                program: { id: mentorShip.program.id },
            });
            await this.programCategoryRepo.save(categories);
        }

        if (description && description.length > 0) {
            await this.programDescriptionRepo.delete({
                program: { id: mentorShip.program.id },
            });
            await this.programDescriptionRepo.save(description);
        }

        const { program, ...mentorshipDetail } = updatedMentorShip;
        program.jobDescriptions = undefined;
        const updatedProg = await this.programRepo.update(
            mentorShip.program.id,
            program,
        );
        const updated = await this.mentorsRepo.update(
            mentorShipId,
            mentorshipDetail,
        );

        const confirmUpdated = UtilityServices.EnsureMultipleUpdated(
            updated,
            updatedProg,
            mentorShipId,
        );
        if (confirmUpdated.success) {
            const mentorshipRepoUpdated = await this.mentorshipRepo.findOneBy({
                id: mentorShipId,
                mentor: { id: mentorId },
            });
            await this.SendNotificationForJobCreatedToAdmin(
                mentorshipRepoUpdated,
            );
        }

        return confirmUpdated;
    }

    private async SendNotificationForJobCreatedToAdmin(mentorShip: Mentorship) {
        const user = await this.userService.findOneUser(
            mentorShip.createdBy,
            LoginBy.EMAIL,
        );

        const metaData = {
            programId: mentorShip.program.id,
            mentorShipId: mentorShip.id,
        };
        if (mentorShip.program.isPublished) {
            this.notificationService.send({
                channel: NotificationChannel.InApp,
                subject:
                    'New Mentorship Program Posting Awaiting Your Approval!',
                content: `A new Mentorship Program has been submitted by <b>${user.profile.firstName}</b> for <b>${mentorShip.program.title}</b>. Please review and approve this posting to make it visible to Mentees.`,
                to: user.id, // TODO : SEND TO ADMIN THAT CREATED THE MENTOR
                reference: user.id, // TODO : SEND TO ADMIN THAT CREATED THE MENTOR
                isRealTimeNotification: true,
                isNotifyToAllUser: false,
                type: NotificationType.Mentorship,
                metaData,
            });
        }
    }

    async approve(id: string, status: ApprovalType, note?: string) {
        const mentor = await this.mentorsRepo.findOneBy({ id });
        if (!mentor) {
            throw new EntityNotFoundException('Mentor');
        }

        const updatedMentor = await this.mentorsRepo.update(
            { id },
            { status, note },
        );

        const result = UtilityServices.EnsureUpdated(updatedMentor, id);
        return result;
    }

    private async GetMentorship(dto: CreateMentorShipProgramRequestDto) {
        const mentorship = this.mentorshipRepo.create(dto);
        const program = await this.jobPortalService.GetProgram(dto);
        program.programType = ProgramType.Mentorship;
        mentorship.program = program;

        return mentorship;
    }

    async getMentorshipDetail(id: string) {
        const mentor = await this.mentorsRepo.findOneBy({
            profile: { id },
        });

        const profile = await this.profileService.findById(id);
        const userDetails = new UserDetails();
        userDetails.mentorId = mentor?.id;
        userDetails.profileId = profile?.id;
        return userDetails;
    }

    getByStatusPaginated(q: string, arg1?: string, arg2?: boolean) {
        throw new Error('Method not implemented.');
    }

    async filterPrograms(
        filter: GetJobsRequestDto,
        applicantId: string = null,
    ) {
        const query = this.programRepo
            .createQueryBuilder('program')
            .leftJoin('program.jobCategory', 'jobCategory')
            .leftJoin('jobCategory.category', 'category');

        query.andWhere('program.status = :status', {
            status: ApprovalType.Approved,
        });
        query.andWhere('program.isPublished = :isPublished', {
            isPublished: true,
        });

        query.andWhere('program.isClosed = :isClosed', {
            isClosed: false,
        });

        query.andWhere('program.deadline > :now', { now: new Date() });

        if (filter.title) {
            query.andWhere('LOWER(program.title) LIKE LOWER(:title)', {
                title: `%${filter.title}%`,
            });
        }

        if (filter.categoryId) {
            query.andWhere('category.id = :categoryId', {
                categoryId: filter.categoryId,
            });
        }

        if (filter.experianceLevel) {
            query.andWhere('program.experianceLevel = :experianceLevel', {
                experianceLevel: filter.experianceLevel,
            });
        }

        if (filter.countryId) {
            query.andWhere('program.countryId = :countryId', {
                countryId: filter.countryId,
            });
        }

        if (filter.stateId) {
            query.andWhere('program.stateId = :stateId', {
                stateId: filter.stateId,
            });
        }

        if (filter.cityId) {
            query.andWhere('program.cityId = :cityId', {
                cityId: filter.cityId,
            });
        }
        if (filter.programType) {
            query.andWhere('program.programType = :programType', {
                programType: filter.programType,
            });

            this.FilterUsingMentorOrJob(filter, query);
        }

        query.orderBy('program.postedDate', 'DESC');

        let programsApplied: string[] = null;
        if (applicantId) {
            const applied =
                await this.jobPortalService.programsApplied(applicantId);
            programsApplied = applied.map((x) => x.program?.id);
        }

        let programsSaved: string[] = null;
        if (applicantId) {
            const applied =
                await this.jobPortalService.savedPrograms(applicantId);
            programsSaved = applied.map((x) => x.program?.id);
        }

        //const queryStr = query.getSql();
        const [data, total] = await query
            .skip((filter.pagination.page - 1) * filter.pagination.limit)
            .take(filter.pagination.limit)
            .getManyAndCount();
        const programList = data.map(
            (program) =>
                new ProgramsResponseDto(
                    program,
                    programsApplied,
                    programsSaved,
                ),
        );
        return new PaginatedResponseDto<ProgramsResponseDto[]>(
            programList,
            total,
            filter.pagination.page,
            filter.pagination.limit,
        );
    }

    private FilterUsingMentorOrJob(filter: GetJobsRequestDto, query) {
        if (filter.programType === ProgramType.Job) {
            query.leftJoin('job', 'job', 'job.programId = program.id');

            this.FilterForJobType(filter, query);
        }

        if (filter.programType === ProgramType.Mentorship) {
            query.leftJoin(
                'mentorship',
                'mentorship',
                'mentorship.programId = program.id',
            );

            this.FilterForMentorType(filter, query);
        }
    }

    private FilterForMentorType(filter: GetJobsRequestDto, query) {
        if (filter.mentorshipType) {
            query.andWhere('mentorship.mentorshipType = :mentorshipType', {
                mentorshipType: filter.mentorshipType,
            });
        }

        if (filter.commitment) {
            query.andWhere('mentorship.commitment = :commitment', {
                commitment: filter.commitment,
            });
        }

        if (filter.duration) {
            query.andWhere('mentorship.duration = :duration', {
                duration: filter.duration,
            });
        }

        if (filter.audience) {
            query.andWhere('mentorship.mentorshipType = :mentorshipType', {
                audience: filter.audience,
            });
        }

        if (filter.mentorId) {
            query.andWhere('mentorship.mentorId = :mentorId', {
                mentorId: filter.mentorId,
            });
        }
    }

    private FilterForJobType(filter: GetJobsRequestDto, query) {
        if (filter.type) {
            query.andWhere('job.type = :employmentType', {
                employmentType: filter.type,
            });
        }

        if (filter.salaryType) {
            query.andWhere('job.salaryType = :salaryType', {
                salaryType: filter.salaryType,
            });
        }

        if (filter.salaryFrequency) {
            query.andWhere('job.salaryFrequency = :salaryFrequency', {
                salaryFrequency: filter.salaryFrequency,
            });
        }

        if (filter.currency) {
            query.andWhere('job.currency = :currency', {
                currency: filter.currency,
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
    }

    async remove(id: string, mentorId: string) {
        const job = await this.mentorshipRepo.findOneBy({
            id,
            mentor: { id: mentorId },
        });

        if (!job) {
            throw new EntityNotFoundException('Mentorship program not found');
        }

        return this.mentorshipRepo.softDelete(id);
    }
    async findOneByProgramId(id: string) {
        const program = await this.mentorshipRepo
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
        if (!program) {
            throw new EntityNotFoundException('Mentorship');
        }

        return program;
    }

    async getAllByMentorPaginated(
        paginationDto: string,
        mentorId: string,
        isOnlyDraft?: boolean,
        isOnlyPublished?: boolean,
    ) {
        const deserialized = entityParamDeserializer(paginationDto);

        const searchableColumns = ['program.title', 'program.description'];

        const queryString = entityParamSerializer({
            ...deserialized,
            f: [
                mentorId
                    ? { f: 'mentor.id', v: mentorId, o: 'eq' } // Uncommented filter
                    : {},
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
                relation: 'entity.mentor',
                alias: 'mentor',
            },
            {
                relation: 'entity.program',
                alias: 'program',
            },
        ];

        const { data: mentors, total } =
            await this.queryBuilderService.buildQuery(
                this.mentorshipRepo,
                queryString,
                joinOptions,
                searchableColumns,
            );

        //const jobsList = jobs.map((org) => new JobResponseDto(org));

        return new PaginatedResponseDto<Mentorship[]>(
            mentors,
            total,
            deserialized.p,
            deserialized.pp,
        );
    }

    async findAllPaginated(dto: string, exportList = false) {
        // Convert PaginationDto to the format expected by QueryBuilderService
        const { p, pp, s, f, o } = entityParamDeserializer(dto);

        const queryParams: EntityParam = {
            p,
            pp,
            s,
            f,
            o: o || [{ f: 'createdAt', d: 'desc' }],
        };
        // Define searchable columns (if applicable)
        const searchableColumns = ['name']; // Add other searchable columns if needed
        if (exportList) {
            queryParams.p = 0;
            queryParams.pp = 0;
        }
        const queryString = entityParamSerializer(queryParams);

        // Use the QueryBuilderService to build and execute the query
        const { data: mentors, total } =
            await this.queryBuilderService.buildQuery(
                this.mentorsRepo,
                queryString,
                [
                    {
                        relation: 'entity.profile',
                        alias: 'profile',
                    },
                ], // No joins needed for this query
                searchableColumns,
            );

        // Map the results to the response DTO
        //return mentors;
        return new PaginatedResponseDto<Mentors[]>(mentors, total, p, pp);
    }
}
