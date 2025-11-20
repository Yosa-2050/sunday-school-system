import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordService } from '@shega/Utilities/password.service';
import { JobPortalModule } from '@shega/education/qualification.module';
import { LmsModule } from '@shega/lms/lms.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { OrganizationModule } from '@shega/organization/organization.module';
import { UsersModule } from '@shega/users/users.module';
import { ClsModule } from 'nestjs-cls';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        ClsModule,
        UsersModule,
        PassportModule,
        NotificationModule,
        OrganizationModule,
        JobPortalModule,
        LmsModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
