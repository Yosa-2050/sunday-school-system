import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { PasswordService } from "src/Utilities/password.service";
import { NotificationModule } from "src/notification/notification.module";
import { OrganizationModule } from "src/organization/organization.module";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    NotificationModule,
    OrganizationModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
