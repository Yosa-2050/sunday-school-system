import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.reponse.dto';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateBasicUserDto } from '@shega/users/dto/create-user.dto';
import { UserRoleType, UserRoleValue } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
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
import { MentorshipsResponseDto } from './dto/response/mentorships.response.dto';
import { Mentors } from './entities/mentor.entity';
import { Mentorship } from './entities/mentorship.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { JobPortalService } from './job_portal.service';

@Injectable()
export class MentorshipService {
    async findOne(id: string) {
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
            .where('mentorship.id = :id', { id })
            .getOne();
        if (!program) {
            throw new EntityNotFoundException('Job');
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

        const searchableColumns = [
            'program.title',
            'program.description',
            'organization.name',
        ];

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
        return mentors;
        //    return new PaginatedResponseDto<GetOrganizationListResponseDto[]>(
        //        organizations.map((org) => new GetOrganizationListResponseDto(org)),
        //        total,
        //        p,
        //        pp,
        //    );
    }

    constructor(
        @InjectRepository(Mentors)
        private mentorsRepo: Repository<Mentors>,
        @InjectRepository(Mentorship)
        private mentorshipRepo: Repository<Mentorship>,
        private jobPortalService: JobPortalService,
        private passwordService: PasswordService,
        private profileService: ProfileService,
        private notificationService: NotificationService,
        private queryBuilderService: QueryBuilderService,
    ) {}

    async createMentor(dto: CreateBasicUserDto) {
        const pwdGenerated = this.passwordService.generatePassword();

        const role = UserRoleType.Mentor;

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

    async create(mentorId: string, dto: CreateMentorShipProgramRequestDto) {
        const mentor = await this.mentorsRepo.findOneBy({ id: mentorId });

        if (mentor?.status !== ApprovalType.Approved) {
            throw new BadRequestException(
                'Mentor is not approved, please contact your administrator',
            );
        }

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
        const jobCreated = await this.mentorshipRepo.save(mentorShip);
        return UtilityServices.EnsureCreated(jobCreated.id);
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

    // update(id: string, updateJobPortalDto: UpdateJobPortalDto, arg2: string) {
    //     throw new Error('Method not implemented.');
    // }
    // findOne(id: string) {
    //     throw new Error('Method not implemented.');
    // }
    // getByStatusAndByMentorPaginated(arg0: string, q: string, arg2: boolean) {
    //     throw new Error('Method not implemented.');
    // }
    // getByList(list: string[]): any[] | PromiseLike<any[]> {
    //     throw new Error('Method not implemented.');
    // }
    getByStatusPaginated(q: string, arg1?: string, arg2?: boolean) {
        throw new Error('Method not implemented.');
    }

    async filterPrograms(filter: GetJobsRequestDto, applicantId: string = null) {
        const query = this.mentorshipRepo.createQueryBuilder('mentorship');
        query.leftJoinAndSelect('mentorship.program', 'program');
        query.leftJoinAndSelect('mentorship.mentor', 'mentor');
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

        let programsApplied: string[] = null;
        if (applicantId) {
            const applied =
                await this.jobPortalService.jobsApplied(applicantId);
            programsApplied = applied.map((x) => x.program?.id);
        }
        //const queryStr = query.getSql();
        const [data, total] = await query
            .skip((filter.pagination.page - 1) * filter.pagination.limit)
            .take(filter.pagination.limit)
            .getManyAndCount();
        const jobsList = data.map(
            (job) => new MentorshipsResponseDto(job, programsApplied),
        );
        return new PaginatedResponseDto<MentorshipsResponseDto[]>(
            jobsList,
            total,
            filter.pagination.page,
            filter.pagination.limit,
        );
    }
}
