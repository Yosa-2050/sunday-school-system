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
    Put,
    Query,
    Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    ExportWithQueryRequestModel,
    StringRequestModel,
} from '@shega/Utilities/models/list-string.model';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { DocumentService } from '@shega/document/document.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationType } from '@shega/notification/enums/notification-type.enum';
import { NotificationService } from '@shega/notification/notification.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { updatePasswordRequest } from './dto/update-password.request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginBy } from './enums/login-by.enum';
import { UserRoleType } from './enums/user-role.enum';
import { UsersService } from './users.service';
import { AddRoleDto } from './dto/request/add-role.request.dto';
import { ProfileService } from './profile.service';
import { Public } from '@shega/auth/jwt-public';

@Public()
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly profileService: ProfileService,
        private notificationService: NotificationService,
        private documentService: DocumentService,
    ) {}

    @Post('all')
    findAll(@Body() dto: { q: string }) {
        return this.usersService.getUsersByUserType(dto.q);
    }

    @Post('add-role')
    addRole(
        @Query('id', new ParseUUIDPipe()) id: string,
        @Body() body: AddRoleDto,
    ) {
        if (!body.role) {
            throw new BadRequestException('Role is required');
        }
        return this.usersService.addRole(id, body.role);
    }

    @Post('export')
    async export(@Body() dto: { q: string }, @Res() res: Response) {
        const data = await this.usersService.getUsersByUserType(dto.q);

        this.documentService.generateCsv(data.data, res, 'userList');
    }

    @Post('exportSelected')
    async exportSelected(
        @Body() dto: ExportWithQueryRequestModel,
        @Res() res: Response,
    ) {
        let data = [];
        if (dto.list?.length > 0) {
            data = await this.usersService.getList(dto.list);
        } else {
            data = (await this.usersService.getUsersByUserType(dto.q, true))
                .data;
        }

        this.documentService.generateCsv(data, res, 'userList');
    }

    //@Post()
    async create(@Body() dto: CreateUserDto) {
        const user = await this.usersService.createFromProfile(
            dto.email,
            dto.role,
            '',
            true,
            LoginBy.EMAIL,
            true,
        );
        if (user?.id) {
            await this.notificationService.send({
                channel: NotificationChannel.Email,
                content: `please login to your account using your email ${user.email} and password 12345678. Then reset your password.`,
                to: user.email,
                subject: 'Herani Sunday School Management System',
                reference: user.id,
                type: NotificationType.User,
                metaData: null,
            });
            return user;
        }

        throw new BadRequestException('Unable to create user');
    }

    @Post('updatePassword')
    updatePassword(@Body() updatePwdDto: updatePasswordRequest) {
        return this.usersService.UpdatePassword(updatePwdDto);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.usersService.remove(id);
    }

    @Roles(UserRoleType.SuperAdmin)
    @Put('activate/:userId')
    activateUser(@Param('userId') userId: string) {
        return this.usersService.setUserActivationStatus(userId, true, '');
    }

    @Roles(UserRoleType.SuperAdmin)
    @Put('deactivate/:userId')
    deactivateUser(
        @Param('userId') userId: string,
        @Body() dto: StringRequestModel,
    ) {
        return this.usersService.setUserActivationStatus(
            userId,
            false,
            dto.text,
        );
    }

    @Get('byProfileId/:profileId')
    getByProfileId(@Param('profileId', new ParseUUIDPipe()) profileId: string) {
        return this.profileService.findUserByProfileId(profileId);
    }
}
