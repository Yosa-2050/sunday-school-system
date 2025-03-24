import {
    BadRequestException,
    Body,
    Controller,
    Delete,
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
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordService } from '@shega/Utilities/password.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
import { getSignupEmailTemplate } from '@shega/notification/sendEmailTemplates/signupEmailTemplate';
// biome-ignore lint/style/useImportType: <explanation>
import { Express } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUserDto } from './dto/create-user.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { NewProfileDto } from './dto/new-profile.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateProfileDto } from './dto/update-profile.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ProfileService } from './profile.service';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private notificationService: NotificationService,
        private passwordService: PasswordService,
    ) {}

    @Post('/new')
    async create(@Body() dto: CreateUserDto) {
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

        if (user?.id) {
            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: getSignupEmailTemplate({
                    userName: dto.firstName,
                    role: dto.role,
                    email: dto.email,
                    tempPassword: pwdGenerated,
                    loginUrl: 'https://office.shega.heranitech.com',
                }),
                to: dto.email,
                subject: 'Shega jobs',
                reference: user.id,
            });
            return user;
        }

        throw new BadRequestException('Unable to create user');
    }

    @ApiOperation({ deprecated: true })
    @Post('/new/:userId')
    newProfle(@Param('userId') userId: string, @Body() body: NewProfileDto) {
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
        return this.profileService.findbyPhone(phone);
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
