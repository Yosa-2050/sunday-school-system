import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUserDto } from './dto/create-user.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { NewProfileDto } from './dto/new-profile.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRoleType, UserRoleValue } from './enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private notificationService: NotificationService,
        private passwordService: PasswordService,
    ) {}

    @Post('upload/profilePicture')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        return this.profileService.uploadProfilePicture(
            CurrentUser.getProfileId(req),
            file,
        );
    }

    @Roles(UserRoleType.Administrator, UserRoleType.SuperAdmin)
    @Post('/new')
    async create(@Request() req, @Body() dto: CreateUserDto) {
        if (
            (dto.role === UserRoleType.Administrator ||
                dto.role === UserRoleType.SuperAdmin) &&
            CurrentUser.getRole(req).toLowerCase() !==
                UserRoleType.SuperAdmin.toLowerCase()
        ) {
            throw new ForbiddenException('Unable to create an administrator');
        }
        const pwdGenerated = this.passwordService.generatePassword();

        const user = await this.profileService.createNewUserProfileQDE(
            dto.email,
            dto.role,
            dto.firstName,
            dto.middleName,
            dto.lastName,
            true,
            pwdGenerated,
            true,
        );

        const signupEmailTemplate = await this.notificationService.getTemplate(
            'signupEmailTemplate',
            {
                userName: dto.firstName,
                role: UserRoleValue(dto.role).value,
                email: dto.email,
                tempPassword: pwdGenerated,
                loginUrl: UserRoleValue(dto.role).url,
            },
            null,
        );

        if (user?.id) {
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

    @ApiOperation({ deprecated: true })
    @Post('/new/:userId')
    newProfile(@Param('userId') userId: string, @Body() body: NewProfileDto) {
        //this.profileService.create(userId, body);
        throw new BadRequestException(
            'This API is deprecated please contact you administrator',
        );
    }
    @Get('/getByEmail')
    getByEmail(@Query('email') email: string) {
        return this.profileService.findByEmail(email);
    }

    @Get('/getByPhone')
    getByPhone(@Query('phone') phone: string) {
        return this.profileService.findByPhone(phone);
    }

    @Post('/profilepicture/:profileId')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    ProfilePicture(
        @Param('profileId') profileId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        this.profileService.createProfilePic(profileId, file);
    }

    @Get('/myprofile')
    getMyProfile(@Request() req) {
        const userId = req.user.userId;

        return this.profileService.findByUserId(userId);
    }

    @Get('/:id')
    findProfile(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.profileService.findOne(id);
    }

    @Delete('/:id')
    deleteProfile(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.profileService.remove(id);
    }

    @Patch('/:id')
    updateProfile(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.profileService.update(id, dto);
    }
}
