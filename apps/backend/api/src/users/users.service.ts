import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResponseDto } from '@shega/Utilities/models/paginated.response';
import { PasswordService } from '@shega/Utilities/password.service';
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
        roles.role = UserRoleType.Administrator;
        user.roles = [roles];
        roles.isDefault = true;
        user.password = await this.passwordService.hashPassword(user.password);
        return this.userRepo.save(user);
    }

    async UpdatePassword(updatePwdDto: updatePasswordRequest) {
        const user = await this.findById(updatePwdDto.id);
        if (!user) {
            throw new BadRequestException('Email doesnt exists');
        }
        const pass = await this.passwordService.hashPassword(
            updatePwdDto.password,
        );
        this.userRepo.update(
            { id: user.id },
            { pwd_change_required: false, password: pass },
        );
        return user;
    }

    async createFromProfile(
        email: string,
        role: UserRoleType,
        password: string,
        saveProfile = true,
        logInType: LoginBy = LoginBy.EMAIL,
        pwdChangeRequired = false,
    ) {
        const check = await this.findOneUser(email, logInType);
        if (check) {
            throw new BadRequestException(`Email ${email} already exists`);
        }

        const user = this.userRepo.create({
            email: email.toLowerCase(),
            password: await this.passwordService.hashPassword(
                password ?? '123456789',
            ),
            pwd_change_required: !password || pwdChangeRequired,
        });
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

        if(exportList){
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
            users.map((user) => new GetPaginatedUsersResponseDto(user)),
            total,
            p,
            pp,
        );
    }
}
