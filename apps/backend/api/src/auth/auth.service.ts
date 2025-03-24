import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { JwtService } from '@nestjs/jwt';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { NotificationService } from '@shega/notification/notification.service';
import { getForgotPwdEmailTemplate } from '@shega/notification/sendEmailTemplates/forgotPwdEmailTemplate';
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
import { ClsService } from 'nestjs-cls';
// biome-ignore lint/style/useImportType: <explanation>
import { PasswordResetDto } from './dtos/request/username.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ValidateResteRequestDto } from './dtos/request/validate-reset.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
    UserDetails,
    UserResponsePayload,
} from './dtos/response/user-response-payload.reponse.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { OriginEnums, validateRole } from './enums/origin.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private otpService: OtpService,
        private notificationService: NotificationService,
        private organizationService: OrganizationService,
        private clasService: ClsService,
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

    async login(user: User, origin: OriginEnums) {
        //let details: any;
        const roles = await this.usersService.getUserRoles(user.id);
        const defaultRole = roles?.find((x) => x.isDefault)?.role;
        if (!validateRole(defaultRole, origin)) {
            throw new UnauthorizedException();
        }
        let details: UserDetails;

        //checking only default roles as the assumption is the user only have one defaul user
        switch (defaultRole) {
            case UserRoleType.Administrator:
                break;
            case UserRoleType.WorkProvider:
                details = await this.organizationService.getOrganizationDetail(
                    user.profile.id,
                );
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
            userId: user.id,
            role: roles?.find((x) => x.isDefault)?.role?.toLowerCase(),
            pwdChangeRequired: user.pwd_change_required,
            id: user.id,
            details: details,
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
                details: details,
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
                content: getForgotPwdEmailTemplate({
                    userName: user.profile.firstName,
                    email: user.email,
                    verificationCode: otp,
                }),
                to: user.email,
                subject: 'OTP',
                reference: user.id,
            });
            return {
                success: 'true',
            };
        }
        throw new BadRequestException('User not found');
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
        const user = await this.usersService.validateUser(
            req.userId,
            req.oldPassword,
            LoginBy.ID,
        );
        if (user) {
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

    CurrentUser() {
        const token = this.clasService.get('token');
        if (token) {
            const user = this.jwtService.decode(token);
            const detail = new UserDetails();
            detail.userId = user.userId;
            detail.email = user.email;
            return detail;
        }
        return null;
    }
}
