import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { PasswordService } from "src/Utilities/password.service";
import { Profile } from "./entities/profile.entity";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { DocumentModule } from "src/document/document.module";
import { EnumsController } from "./enums.controller";
import { OtpService } from "./otp.service";
import { Otp } from "./entities/otp.entity";
import { DateService } from "src/Utilities/date.service";
import { UserRoles } from "./entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Otp, UserRoles]), DocumentModule],
  controllers: [UsersController, ProfileController, EnumsController],
  providers: [UsersService, PasswordService, ProfileService, OtpService, DateService],
  exports: [UsersService, ProfileService, OtpService, DateService],
})
export class UsersModule {}
