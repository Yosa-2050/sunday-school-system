import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityAlreadyExistsException } from '@shega/Utilities/ExceptionHandlers/Exceptions/already-exists.exception';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { UserDetails } from '@shega/auth/dtos/response/user-response-payload.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationDetailsDto } from '@shega/notification/dto/notification-details.dto';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
import { NotificationTemplates } from '@shega/notification/seeds/notification-templates.const';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationUserDto } from '@shega/organization/dto/request/create-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationMemberService } from '@shega/organization/services/organization-member.service';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from '@shega/users/profile.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCalendarYearRequestDto } from '../dto/request/create-calendar-year.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateLmDto } from '../dto/request/create-lm.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateLmDto } from '../dto/request/update-lm.dto';
import { CalendarYear } from '../entities/calendar-year.entity';
import { ProgramUser } from '../entities/program-users.entity';
import { Program } from '../entities/program.entity';

@Injectable()
export class LmsService {
    constructor(
        @InjectRepository(CalendarYear)
        private calendarYearRepo: Repository<CalendarYear>,
        @InjectRepository(Program) private programRepo: Repository<Program>,
        @InjectRepository(ProgramUser)
        private programUserRepo: Repository<ProgramUser>,
        private passwordService: PasswordService,
        private profileService: ProfileService,
        private notificationService: NotificationService,
        private memberServices: OrganizationMemberService,
    ) {}

    async createCalendarYear(
        programId: string,
        dto: CreateCalendarYearRequestDto,
    ) {
        const program = await this.findOneProgram(programId);
        const existing = await this.calendarYearRepo.findOneBy({
            name: dto.name,
            program: { id: programId },
        });

        if (existing) {
            throw new EntityAlreadyExistsException('Program');
        }
        const active = await this.calendarYearRepo.findOneBy({
            isActive: true,
            program: { id: programId },
        });

        if (active) {
            throw new EntityAlreadyExistsException('Active Program');
        }
        const year = this.calendarYearRepo.create(dto);
        year.program = program;
        return this.calendarYearRepo.save(year);
    }
    create(createLmDto: CreateLmDto) {
        return 'This action adds a new lm';
    }

    findAllYear(programId: string) {
        return this.calendarYearRepo.findBy({ program: { id: programId } });
    }

    findOne(id: number) {
        return `This action returns a #${id} lm`;
    }

    update(id: number, updateLmDto: UpdateLmDto) {
        return `This action updates a #${id} lm`;
    }

    remove(id: number) {
        return `This action removes a #${id} lm`;
    }

    getProgram() {
        return this.programRepo.find();
    }
    async createProgram(name: string) {
        const existingProgram = await this.programRepo.findOneBy({ name });
        if (existingProgram) {
            throw new EntityAlreadyExistsException(typeof Program);
        }
        const program = this.programRepo.create({ name });
        return this.programRepo.save(program);
    }

    async findOneProgram(id: string) {
        const program = await this.programRepo.findOneBy({ id });
        if (!program) {
            throw new EntityNotFoundException(typeof Program);
        }
        return program;
    }

    async CreateUserQDE(programId: string, dto: CreateOrganizationUserDto) {
        const program = await this.programRepo.findOneBy({
            id: programId,
        });
        if (!program) {
            throw new EntityNotFoundException('Program');
        }
        const pwdGenerated = this.passwordService.generatePassword();

        const member = await this.memberServices.CreateSQDEMember(
            dto,
            pwdGenerated,
        );

        const model = this.programUserRepo.create();
        model.member = member;
        model.program = program;

        const programUser = await this.programUserRepo.save(model);
        const notificationDetail: NotificationDetailsDto = {
            toEmailAddress: [dto.email],
            referenceId: programUser.member.id,
            templateName: NotificationTemplates.SignUp,
            metaData: {
                userName: dto.email,
                role: UserRoleType.SchoolAdmin,
                tempPassword: pwdGenerated,
            },
        };
        this.notificationService.sendUsingTemplate(
            notificationDetail,
            false,
            NotificationChannel.Email,
        );
        return programUser;
    }

    async AssignUser(programId: string, memberId: string) {
        const program = await this.programRepo.findOneBy({
            name: programId,
        });
        if (program) {
            throw new EntityNotFoundException('Program');
        }

        const profile = await this.memberServices.findByIdOrThrow(memberId);

        const model = this.programUserRepo.create();
        model.member = profile;
        model.program = program;

        return await this.programUserRepo.save(model);
    }

    async GetUsers(programId: string) {
        const programUsers = await this.programUserRepo.findBy({
            program: { id: programId },
        });
        if (programUsers && programUsers.length > 0) {
            return programUsers.map((x) => {
                return x.member;
            });
        }
        return null;
    }

    async activeCalendarYearByProgramId(programId: string) {
        const activeYear = await this.calendarYearRepo.findOneBy({
            program: { id: programId },
            isActive: true,
        });

        if (!activeYear) {
            return null;
        }
        return activeYear;
    }

    async calendarYearById(yearId: string) {
        const activeYear = await this.calendarYearRepo.findOneBy({
            id: yearId,
            isActive: true,
        });

        if (!activeYear) {
            throw new UnauthorizedException();
        }
        return activeYear;
    }

    async getSchoolAdminDetail(id: string) {
        const programUser = await this.programUserRepo.findOneBy({
            member: { id },
        });

        const profile = await this.profileService.findById(id);
        const userDetails = new UserDetails();
        userDetails.programId = programUser?.program?.id;
        userDetails.profileId = profile?.id;
        userDetails.calendarYear = (
            await this.activeCalendarYearByProgramId(programUser?.program?.id)
        )?.id;
        return userDetails;
    }
}
