import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateService } from '@shega/Utilities/date.service';
import { PasswordService } from '@shega/Utilities/password.service';
import { DocumentModule } from '@shega/document/document.module';
import { NotificationModule } from '@shega/notification/notification.module';
import { Otp } from './entities/otp.entity';
import { Profile } from './entities/profile.entity';
import { UserRoles } from './entities/role.entity';
import { User } from './entities/user.entity';
import { EnumsController } from './enums.controller';
import { OtpService } from './otp.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LookupSeederService } from '@shega/Utilities/service/lookup-seeder.service';
import { LookUps } from '@shega/Utilities/entities/lookups.entity';
import { LookupController } from './lookup.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile, Otp, UserRoles, LookUps]),
        DocumentModule,
        NotificationModule,
    ],
    controllers: [UsersController, ProfileController, EnumsController, LookupController],
    providers: [
        UsersService,
        PasswordService,
        ProfileService,
        OtpService,
        DateService,
        LookupSeederService
    ],
    exports: [
        UsersService,
        ProfileService,
        OtpService,
        DateService,
        PasswordService,
        LookupSeederService
    ],
})
export class UsersModule {}
