import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateUserDto } from './dto/create-user.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { updatePasswordRequest } from './dto/update-password.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginBy } from './enums/login-by.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private notificationService: NotificationService,
    ) {}

    @Post()
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
                subject: 'Shega jobs',
                reference: user.id,
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
}
