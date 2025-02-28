import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { JwtService } from '@nestjs/jwt';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from '@shega/organization/organization.service';
// biome-ignore lint/style/useImportType: <explanation>
import { User } from '@shega/users/entities/user.entity';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { OtpService } from '@shega/users/otp.service';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from '@shega/users/users.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ValidateResteRequestDto } from './dtos/request/validate-reset.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UserResponsePayload } from './dtos/response/user-response-payload.reponse.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordResetDto } from './dtos/request/username.dto';

@Injectable()
export class AuthService {
   
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private otpService: OtpService,
        private notificationService: NotificationService,
        private organizationService: OrganizationService,
    ) {}

    async validateUser(
        username: string,
        pass: string,
        type: LoginBy = LoginBy.EMAIL,
    ) {
        const user = await this.usersService.validateUser(username, pass, type);

        //check password
        if (user) {
            const { password, ...result } = user;

            return result;
        }
        return null;
    }

    async login(user: User) {
        //let details: any;
        const roles = await this.usersService.getUserRoles(user.id);

        //checking only default roles as the assumption is the user only have one defaul user
        switch (roles?.find((x) => x.isDefault)?.role) {
            case UserRoleType.Administrator:
                break;
            case UserRoleType.JobSeeker:
                //details = await this.organizationService.getOrganizationDetail(user.profile.id);

                break;
            //   case UserRoleType.PARENT:
            //     break;
            //   case UserRoleType.ADMINISTRATOR:
            //     break;
            //   case UserRoleType.SCHOOL_ADMINISTRATOR:
            //     break;
            //   case UserRoleType.SCHOOL_EMPLOYEE:
            //   case UserRoleType.SCHOOL_FINANCE_OFFICER:
            //   case UserRoleType.BRANCH_ADMINISTRATOR:
            //     break;
            //   default:
            //     throw new BadRequestException("Role is not found");
        }
        const payload: UserResponsePayload = {
            email: user.email,
            sub: user.id,
            role: roles?.find((x) => x.isDefault)?.role?.toLowerCase(),
            pwdChangeRequired: user.pwd_change_required,
            id: user.id,
            //getMyBranchInfo: details,
        };

        return {
            data: {
                role: payload.role,
                email: payload.email,
                access_token: payload.pwdChangeRequired
                    ? ''
                    : this.jwtService.sign(payload),
                pwdChangeRequired: payload.pwdChangeRequired,
                id: payload.id,
                //details: details,
            },
        };
    }

    async resetPassword(username: string) {
        const user = await this.usersService.findOneUser(
            username,
            LoginBy.EMAIL,
        );
        if (user) {
            const otp = await this.otpService.CreateOtp(user.id);
            await this.notificationService.send({
                channel: NotificationChannel.Email,
                content: `Your one time password is ${otp}`,
                to: user.email,
                subject: 'OTP',
                reference: user.id,
            });
            return {
                success: 'true',
            };
        }
        throw new NotFoundException('User not found');
    }
    async validateResetPassword(req: ValidateResteRequestDto) {
        const user = await this.usersService.findOneUser(
            req.username,
            LoginBy.EMAIL,
        );
        if (user) {
            const otp = await this.otpService.validateOtp(user.id, req.otp);
            if (otp) {
                await this.usersService.UpdatePassword({
                    id: user.id,
                    password: req.password,
                });
                return {
                    success: 'true',
                };
            }
            return new BadRequestException('Invalid Otp');
        }
        return new UnauthorizedException();
    }

    async ChangePassword(req: PasswordResetDto) {
        const user = await this.usersService.validateUser(req.userId, req.oldPassword, LoginBy.ID);
        if(user){
            await this.usersService.UpdatePassword({
                id: user.id,
                password: req.newPassword,
            });
            
            return {
                success: 'true',
            };
        }
        throw new UnauthorizedException();
    }
}
