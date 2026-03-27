import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { QualificationDetailService } from '@shega/education/qualification-detail.service';
import { LmsService } from '@shega/lms/services/lms.service';
import { NotificationChannel } from '@shega/notification/enums/notification-channel.enum';
import { NotificationType } from '@shega/notification/enums/notification-type.enum';
import { NotificationService } from '@shega/notification/notification.service';
import { OrganizationService } from '@shega/organization/services/organization.service';
import { User } from '@shega/users/entities/user.entity';
import { LoginBy } from '@shega/users/enums/login-by.enum';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
import { OtpService } from '@shega/users/otp.service';
import { UsersService } from '@shega/users/users.service';
import { ClsService } from 'nestjs-cls';
import { PasswordResetDto } from './dtos/request/username.dto';
import { ValidateResetRequestDto } from './dtos/request/validate-reset.request.dto';
import {
    UserDetails,
    UserResponsePayload,
} from './dtos/response/user-response-payload.response.dto';
import { OriginEnums, validateRole } from './enums/origin.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private otpService: OtpService,
        private notificationService: NotificationService,
        private organizationService: OrganizationService,
        private classService: ClsService,
        private jobService: QualificationDetailService,
        private lmsService: LmsService,
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

    async login(user: User, origin: OriginEnums, selectedRole: UserRoleType) {
        const userRoles = await this.usersService.getUserRoles(user.id);

        // Find a valid role for the current origin, prioritizing the default role if it's valid for this origin
        const allRoles = userRoles.filter((r) => validateRole(r.role, origin));

        if (allRoles?.length == 0) {
            throw new UnauthorizedException(
                `User does not have permission to access ${origin}`,
            );
        }
        let details: UserDetails;

        if (selectedRole) {
            const selectedRoleNeeded = allRoles.find(
                (r) => r.role === selectedRole,
            );

            if (!selectedRoleNeeded) {
                throw new UnauthorizedException(
                    `User does not have permission to access ${selectedRole}`,
                );
            }

            switch (selectedRoleNeeded.role) {
                case UserRoleType.Administrator:
                    break;
                case UserRoleType.SuperAdmin:
                    break;
                case UserRoleType.HomeRoom:
                    details = await this.lmsService.getHomeTeacherDetail(
                        user.profile.id,
                    );
                    break;
                case UserRoleType.Teacher:
                    details = await this.lmsService.getTeacherDetail(
                        user.profile.id,
                    );
                    break;
                case UserRoleType.SchoolAdmin:
                    details = await this.lmsService.getSchoolAdminDetail(
                        user.profile.id,
                    );
                    break;
                case UserRoleType.ProgramAdmin:
                    details = await this.lmsService.getSchoolProgramAdminDetail(
                        user.profile.id,
                    );
                    break;
                default:
                    throw new UnauthorizedException();
            }
        }
        const payload: UserResponsePayload = {
            email: user.email,
            userId: user.id,
            role: selectedRole ?? allRoles[0]?.role?.toLowerCase(),
            allRoles: allRoles?.map((x) => x.role?.toLowerCase()),
            pwdChangeRequired: user.pwd_change_required,
            id: user.id,
            details: details,
        };
        return {
            data: {
                allRoles: payload.allRoles,
                selectRole: selectedRole,
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

    async resetPassword(username: string, origin: OriginEnums) {
        const user = await this.usersService.findOneUser(
            username,
            LoginBy.EMAIL,
        );
        if (
            user &&
            validateRole(user.roles?.find((x) => x.isDefault)?.role, origin)
        ) {
            const otp = await this.otpService.CreateOtp(user.id);
            const forgotPwdEmailTemplate =
                await this.notificationService.getTemplate(
                    'forgotPwdEmailTemplate',
                    {
                        userName: user.profile.firstName,
                        email: user.email,
                        verificationCode: otp,
                    },
                    null,
                );

            this.notificationService.send({
                channel: NotificationChannel.Email,
                content: forgotPwdEmailTemplate.content,
                to: user.email,
                subject: forgotPwdEmailTemplate.subject,
                reference: user.id,
                type: NotificationType.User,
                metaData: null,
            });
            return {
                success: 'true',
            };
        }
        throw new EntityNotFoundException('User');
    }
    async validateResetPassword(req: ValidateResetRequestDto) {
        const user = await this.usersService.findOneUser(
            req.username,
            LoginBy.EMAIL,
        );
        if (user) {
            const otp = await this.otpService.validateOtp(user.id, req.otp);
            if (otp) {
                return await this.usersService.UpdatePassword({
                    id: user.id,
                    password: req.password,
                });
            }
            throw new BadRequestException('Invalid Otp');
        }
        throw new UnauthorizedException();
    }

    async ChangePassword(req: PasswordResetDto) {
        const user = await this.usersService.validateUser(
            req.userId,
            req.oldPassword,
            LoginBy.ID,
        );
        if (user) {
            return this.usersService.UpdatePassword({
                id: user.id,
                password: req.newPassword,
            });
        }
        throw new UnauthorizedException();
    }

    CurrentUser() {
        const token = this.classService.get('token');
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
