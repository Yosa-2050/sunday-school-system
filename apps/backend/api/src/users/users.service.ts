import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '@shega/Utilities/password.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUserDto } from './dto/create-user.dto';
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
        user.password = await this.passwordService.hashPassword(
            updatePwdDto.password,
        );
        user.pwd_change_required = false;
        this.userRepo.update({ id: user.id }, user);
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
            email,
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
                user = await this.userRepo.findOneBy({ email: login });
                break;
            case LoginBy.ID:
                user = await this.userRepo.findOneBy({ id: login });
                break;
            case LoginBy.USERNAME:
                user = await this.userRepo.findOneBy({ userName: login });
                break;
        }
        if (user) {
            user.roles = await user.roles;
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
}
