import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from '@shega/Utilities/password.service';
import { NotificationModule } from '@shega/notification/notification.module';
import { OrganizationModule } from '@shega/organization/organization.module';
import { UsersModule } from '@shega/users/users.module';
import { ClsModule } from 'nestjs-cls';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { JobPortalModule } from '@shega/job_portal/job_portal.module';

@Module({
    imports: [
        ClsModule,
        UsersModule,
        PassportModule,
        NotificationModule,
        OrganizationModule,
        JobPortalModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
