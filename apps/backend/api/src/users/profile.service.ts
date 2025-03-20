import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from '@shega/users/users.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { ILike, Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { NewProfileDto } from './dto/new-profile.dto';
import { Profile } from './entities/profile.entity';
import { LoginBy } from './enums/login-by.enum';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile) private repo: Repository<Profile>,
        private userService: UsersService,
        private documentService: DocumentService,
        private passwordService: PasswordService,
    ) {}

    async createNewUserProfile(
        email: string,
        password: string,
        role: UserRoleType,
        dto: NewProfileDto,
        file: Express.Multer.File = null,
        saveProfile = true,
    ) {
        const user = await this.userService.createFromProfile(
            email,
            role,
            password,
            false,
            LoginBy.EMAIL,
            true,
        );
        if (user) {
            const profile = this.repo.create(dto);
            profile.user = user;
            if (saveProfile) {
                return this.repo.save(profile);
            }
            return profile;
        }

        throw new BadRequestException('No user');
    }

    async createNewUserProfileQDE(
        email: string,
        role: UserRoleType,
        firstName: string,
        middleName: string,
        lastName: string,
        saveProfile = true,
        password = '',
        pwdChangeRequired = false,
    ) {
        const user = await this.userService.createFromProfile(
            email,
            role,
            password,
            false,
            LoginBy.EMAIL,
            pwdChangeRequired,
        );
        if (user) {
            const profile = this.repo.create({
                firstName,
                middleName,
                lastName,
            });
            profile.user = user;
            if (saveProfile) {
                return this.repo.save(profile);
            }
            return profile;
        }

        throw new BadRequestException('No user');
    }

    async createProfilePic(profileId: string, file: Express.Multer.File) {
        const profile = await this.repo.findOneBy({ id: profileId });
        if (profile && file) {
            const docId = await this.documentService.create(file, profile.id);
            profile.profile_picture_id = docId;

            this.repo.update({ id: profileId }, profile);
        }
    }

    async findByUserId(userId: string) {
        const user = await this.userService.findById(userId);

        //FIXME: check this one later
        if (user) {
            const profile = await this.repo.findOneBy({
                id: user?.profile?.id,
            });
            const tt = { ...profile, roles: user.roles };
            return tt;
        }

        throw new BadRequestException();
    }

    async findOne(id: string) {
        const profile = await this.repo.findOneBy({ id });
        if (profile.profile_picture_id) {
            profile.profile_picture_id = await this.documentService.findOne(
                profile.profile_picture_id,
            );
        }
        await profile.user;
        return profile;
    }

    find() {
        return this.repo.find();
    }

    async findByEmail(email: string) {
        return await this.repo.findBy({
            user: {
                email: ILike(`%${email}%`),
            },
        });
    }

    async findbyPhone(phone: string) {
        return await this.repo.findBy({ phoneNumber: ILike(`%${phone}%`) });
    }

    async update(id: string, attrs: Partial<Profile>) {
        const profile = await this.findOne(id);

        if (!profile) {
            throw new BadRequestException('profile not found');
        }

        Object.assign(profile, attrs);
        return this.repo.save(profile);
    }

    async remove(id: string) {
        const profile = await this.findOne(id);

        if (!profile) {
            throw new BadRequestException('profile not found');
        }

        return this.repo.remove(profile);
    }
}
