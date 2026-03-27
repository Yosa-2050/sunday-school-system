import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { PasswordService } from '@shega/Utilities/password.service';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { DocumentService } from '@shega/document/document.service';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { UsersService } from '@shega/users/users.service';
import { Express } from 'express';
import { ILike, Repository } from 'typeorm';
import { NewProfileDto } from './dto/new-profile.dto';
import { Profile } from './entities/profile.entity';
import { RelationShips } from './entities/relationships.entity';
import { LoginBy } from './enums/login-by.enum';
import { Gender } from './enums/profile-gender.enum';
import { RelationShipsType } from './enums/relationship-type.enum';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile) private repo: Repository<Profile>,
        @InjectRepository(RelationShips)
        private relationShipsRepo: Repository<RelationShips>,
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

        throw new EntityNotFoundException('User');
    }

    async createNewUserProfileQDE(
        userName: string,
        logInType: LoginBy,
        role: UserRoleType,
        firstName: string,
        middleName: string,
        lastName: string,
        phoneNumber: string,
        gender: Gender,
        birthDate: string,
        baptistName: string,
        saveProfile = true,
        password = '',
        pwdChangeRequired = false,
    ) {
        const user = await this.userService.createFromProfile(
            userName,
            role,
            password,
            false,
            logInType,
            pwdChangeRequired,
        );
        if (user) {
            const profile = this.repo.create({
                firstName,
                middleName,
                lastName,
                phoneNumber,
                gender,
                birthDate,
                baptistName,
            });
            profile.user = user;
            if (saveProfile) {
                return this.repo.save(profile);
            }
            return profile;
        }

        throw new EntityNotFoundException('User');
    }

    createProfileQDE(
        firstName: string,
        middleName: string,
        lastName: string,
        phoneNumber: string,
    ) {
        return this.repo.create({
            firstName,
            middleName,
            lastName,
            phoneNumber,
        });
    }

    createRelationShips(
        profile1: Profile,
        profile2: Profile,
        relationShipType: RelationShipsType,
        isEmergency: boolean,
        isParent: boolean,
    ) {
        const entity = this.relationShipsRepo.create();
        entity.profile1 = profile1;
        entity.profile2 = profile2;
        entity.isEmergency = isEmergency;
        entity.isParent = isParent;
        entity.type = relationShipType;
        return entity;
    }

    updateProfileQDE(
        id: string,
        firstName: string,
        middleName: string,
        lastName: string,
        phoneNumber: string,
    ) {
        return this.repo.update(
            { id },
            { firstName, middleName, lastName, phoneNumber },
        );
    }

    async createProfilePic(profileId: string, file: Express.Multer.File) {
        const profile = await this.repo.findOneBy({ id: profileId });
        if (profile && file) {
            const docId = await this.documentService.create(file, profile.id);
            profile.profile_picture_id = docId;

            this.repo.update({ id: profileId }, profile);
        }
    }

    findById(profileId: string) {
        return this.repo.findOneBy({ id: profileId });
    }

    async findByIdOrThrow(profileId: string) {
        return await this.repo.findOneByOrFail({ id: profileId });
    }

    async findByUserId(userId: string) {
        const user = await this.userService.findById(userId);

        //FIXME: check this one later
        if (user) {
            if (user.profile?.id) {
                const profile = await this.repo.findOneBy({
                    id: user?.profile?.id,
                });
                const tt = { ...profile, user: user };
                return tt;
            }
            return { user: user };
        }

        throw new EntityNotFoundException('User');
    }

    async finProfileByUserId(userId: string) {
        const profile = await this.repo.findOneBy({ user: { id: userId } });

        if (profile) {
            return profile;
        }

        throw new EntityNotFoundException('Profile');
    }

    async findOne(id: string) {
        const profile = await this.repo.findOneBy({ id });
        if (profile.profile_picture_id) {
            // profile.profile_picture_id = await this.documentService.findOne(
            //     profile.profile_picture_id,
            // );
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
                email,
            },
        });
    }

    async findByPhone(phone: string) {
        return await this.repo.findBy({ phoneNumber: ILike(`%${phone}%`) });
    }

    async update(id: string, attrs: Partial<Profile>) {
        const profile = await this.findOne(id);

        if (!profile) {
            throw new EntityNotFoundException('Profile');
        }

        Object.assign(profile, attrs);
        return this.repo.save(profile);
    }

    async remove(id: string) {
        const profile = await this.findOne(id);

        if (!profile) {
            throw new EntityNotFoundException('Profile');
        }

        return this.repo.remove(profile);
    }

    async uploadProfilePicture(profileId: string, file: Express.Multer.File) {
        const documentId = await this.documentService.create(file, profileId);

        const updated = await this.repo.update(
            { id: profileId },
            { profile_picture_id: documentId }, //CV from file upload
        );

        return UtilityServices.EnsureUpdated(updated, profileId);
    }

    async findUserByProfileId(profileId: string) {
        const profile = await this.findById(profileId);

        if (!profile) {
            throw new BadRequestException(
                `Profile not found with profileId ${profileId}.`,
            );
        }

        const user = profile.user;
        return user;
    }

    async getRelatives(profileId: string) {
        const relationships = await this.relationShipsRepo.findBy({
            profile1: { id: profileId },
        });
        const result = [];
        for (let index = 0; index < relationships.length; index++) {
            const element = relationships[index];
            const profile = await element.profile2;
            result.push({
                ...profile,
                type: element.type,
                isEmergency: element.isEmergency,
                isParent: element.isParent,
            });
        }
        return result;
    }
}
