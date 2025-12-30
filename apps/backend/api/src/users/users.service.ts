import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationType } from '@shega/notification/enums/notification-type.enum';
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { QueryBuilderService } from 'shared/query-builder.service';
import {
    type EntityParam,
    entityParamDeserializer,
    entityParamSerializer,
} from 'shared/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { In, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUserDto } from './dto/create-user.dto';
import { GetPaginatedUsersResponseDto } from './dto/response/get-all-user.paginated.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { updatePasswordRequest } from './dto/update-password.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from './entities/role.entity';
import { User } from './entities/user.entity';
import { LoginBy } from './enums/login-by.enum';
import { UserRoleType } from './enums/user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(UserRoles)
        private userRoleRepo: Repository<UserRoles>,
        @Inject(PasswordService) private passwordService: PasswordService,
        private readonly queryBuilderService: QueryBuilderService,
        @Inject(NotificationService)
        private notificationService: NotificationService,
    ) {}

    async createMainAdministrator(createUserDto: CreateUserDto) {
        const check = await this.findOneUser(
            createUserDto.email,
            LoginBy.EMAIL,
        );
        if (check) {
            throw new BadRequestException(
                `Email ${createUserDto.email} already exists`,
            );
        }
        const user = this.userRepo.create(createUserDto);
        user.email = user.email.toLowerCase();
        const roles = this.userRoleRepo.create();
        roles.role = UserRoleType.SuperAdmin;
        user.roles = [roles];
        roles.isDefault = true;
        user.password = await this.passwordService.hashPassword(user.password);
        return this.userRepo.save(user);
    }

    async UpdatePassword(updatePwdDto: updatePasswordRequest) {
        const user = await this.findById(updatePwdDto.id);
        if (!user) {
            throw new EntityNotFoundException('User');
        }
        const pass = await this.passwordService.hashPassword(
            updatePwdDto.password,
        );
        const updatedUser = await this.userRepo.update(
            { id: user.id },
            { pwd_change_required: false, password: pass },
        );

        return UtilityServices.EnsureUpdated(updatedUser, updatePwdDto.id);
    }

    async createFromProfile(
        userName: string,
        role: UserRoleType,
        password: string,
        saveProfile = true,
        logInType: LoginBy = LoginBy.EMAIL,
        pwdChangeRequired = false,
    ) {
        const check = await this.findOneUser(userName, logInType);
        if (check) {
            throw new BadRequestException(
                `User name ${userName} already exists`,
            );
        }

        const user = this.userRepo.create({
            password: await this.passwordService.hashPassword(
                password ?? '123456789',
            ),
            pwd_change_required: !password || pwdChangeRequired,
        });
        switch (logInType) {
            case LoginBy.EMAIL:
                user.email = userName.toLowerCase();
                break;
            case LoginBy.ID:
                user.id = userName.toLowerCase();
                break;
            case LoginBy.USERNAME:
                user.userName = userName.toLowerCase();
                break;
        }
        const roles = this.userRoleRepo.create();
        roles.role = role;
        roles.isDefault = true;
        user.roles = [roles];
        if (saveProfile) {
            return await this.userRepo.save(user);
        }
        return user;
    }

    findById(id: string) {
        return this.userRepo.findOneBy({ id });
    }

    async getList(list: string[]) {
        const users = await this.userRepo.find({ where: { id: In(list) } });

        return users.map((user) => new GetPaginatedUsersResponseDto(user));
    }

    async validateUser(login: string, password: string, type: LoginBy) {
        const user = await this.findOneUser(login, type);
        if (
            user &&
            (await this.passwordService.comparePasswords(
                password,
                user.password,
            ))
        ) {
            if (!user.isActive) {
                throw new ForbiddenException('Your account is in active');
            }
            return user;
        }
        return null;
    }

    async findOneUser(login: string, type: LoginBy) {
        let user: User;
        switch (type) {
            case LoginBy.EMAIL:
                user = await this.userRepo.findOneBy({
                    email: login.toLowerCase(),
                });
                break;
            case LoginBy.ID:
                user = await this.userRepo.findOneBy({ id: login });
                break;
            case LoginBy.USERNAME:
                user = await this.userRepo.findOneBy({ userName: login });
                break;
        }
        if (user) {
            return user;
        }
        return null;
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    async setUserActivationStatus(
        id: string,
        isUserActive: boolean,
        note: string,
    ) {
        const updatedUser = await this.userRepo.preload({
            id,
            isActive: isUserActive,
            note: note,
        });
        if (!updatedUser) {
            throw new BadRequestException('User not found');
        }

        //prepare email template
        let emailTemplate = null;
        const user = await this.findById(updatedUser.id);
        //for activate
        if (isUserActive) {
            emailTemplate = await this.notificationService.getTemplate(
                'userActivateEmailTemplate',
                {
                    firstName: user.profile.firstName,
                    email: user.email,
                    //  url:'',
                },
                {
                    fullName: `${user.profile.firstName} ${user.profile.middleName} ${user.profile.lastName}`,
                },
            );
        }
        //for deactivate
        if (!isUserActive) {
            emailTemplate = await this.notificationService.getTemplate(
                'userDeactivateEmailTemplate',
                {
                    firstName: user.profile.firstName,
                    email: user.email,
                    reasonForDeactivate: note,
                },
                {
                    fullName: `${user.profile.firstName} ${user.profile.middleName} ${user.profile.lastName}`,
                },
            );
        }

        //send email
        this.notificationService.send({
            channel: NotificationChannel.Email,
            content: emailTemplate.content,
            to: user.email,
            subject: emailTemplate.subject,
            reference: user.id,
            type: NotificationType.User,
            metaData: null,
        });

        return this.userRepo.save(updatedUser);
    }

    async setUserActivationStatusFromOrg(
        id: string,
        isUserActive: boolean,
        organizationName: string,
        note: string,
    ) {
        const updatedUser = await this.userRepo.preload({
            id,
            isActive: isUserActive,
            note: note,
        });
        if (!updatedUser) {
            throw new EntityNotFoundException('User');
        }

        //prepare email template
        let emailTemplate = null;
        const user = await this.findById(updatedUser.id);
        //for activate
        if (isUserActive) {
            emailTemplate = await this.notificationService.getTemplate(
                'orgActivateEmailTemplate',
                {
                    contactPerson: user.profile.firstName,
                },
                {
                    organizationName: organizationName,
                },
            );
        }
        //for deactivate
        if (!isUserActive) {
            emailTemplate = await this.notificationService.getTemplate(
                'orgDeactivateEmailTemplate',
                {
                    contactPerson: user.profile.firstName,
                    reasonFordeactivate: note,
                },
                {
                    organizationName: organizationName,
                },
            );
        }

        //send email
        //TODO: In future, we will send an email to the contact person from multiple employees in specific organization
        this.notificationService.send({
            channel: NotificationChannel.Email,
            content: emailTemplate.content,
            to: user.email,
            subject: emailTemplate.subject,
            reference: user.id,
            type: NotificationType.User,
            metaData: null,
        });

        return this.userRepo.save(updatedUser);
    }

    remove(id: string) {
        return this.userRepo.softDelete(id);
    }

    getUserRoles(userId: string) {
        return this.userRoleRepo.findBy({ user: { id: userId } });
    }

    async getUsersByUserType(payload: string, exportList = false) {
        const { p, pp, s, f, o } = entityParamDeserializer(payload);

        const queryParams: EntityParam = {
            p,
            pp,
            s,
            f,
            o: o || [{ f: 'createdAt', d: 'desc' }],
        };

        if (exportList) {
            queryParams.p = 0;
            queryParams.pp = 0;
        }

        const queryString = entityParamSerializer(queryParams);

        // Instead of separate columns, use a concatenated full name
        const searchableColumns = [
            'entity.email',
            // Use SQL concatenation for full name
            // The exact syntax might vary depending on your database (PostgreSQL, MySQL, etc.)
            `CONCAT(profile.firstName, ' ', COALESCE(profile.middleName, ''), ' ', profile.lastName)`,
        ];

        const joinOptions = [
            {
                relation: 'entity.profile',
                alias: 'profile',
            },
            {
                relation: 'entity.roles',
                alias: 'roles',
            },
        ];

        const { data: users, total } =
            await this.queryBuilderService.buildQuery(
                this.userRepo,
                queryString,
                joinOptions,
                searchableColumns,
            );

        return new PaginatedResponseDto(
            users
                .filter((user) => user.profile)
                .map((user) => new GetPaginatedUsersResponseDto(user)),
            total,
            p,
            pp,
        );
    }

    GetSuperAdmin() {
        return this.findOneUser(process.env.default_user, LoginBy.EMAIL);
    }

    search(query: string) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        return this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('profile.firstName ILIKE :query', { query: `%${query}%` })
            .orWhere('profile.middleName ILIKE :query', { query: `%${query}%` })
            .orWhere('profile.lastName ILIKE :query', { query: `%${query}%` })
            .orWhere('user.email ILIKE :query', { query: `%${query}%` })
            .orderBy('profile.firstName', 'ASC')
            .limit(10)
            .getMany();
    }

    async addRole(id: string, role: UserRoleType) {
        const user = await this.userRepo.findOneBy({ profile: { id } });
        const existingRoles = await this.userRoleRepo.findOneBy({
            user: { id: user.id },
            role,
        });
        if (!existingRoles) {
            const newRole = this.userRoleRepo.create();
            newRole.user = user;
            newRole.role = role;
            return this.userRoleRepo.save(newRole);
        }
        return existingRoles;
    }
}
