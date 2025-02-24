import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Public } from "./jwt-public";
import { ApiBody } from "@nestjs/swagger";
import { LoginRequestDto } from "./dtos/request/login.dto";
import { UsernameRequestDto } from "./dtos/request/username.dto";
import { ValidateResteRequestDto } from "./dtos/request/validate-reset.request.dto";

@Controller("auth")
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiBody({type: LoginRequestDto})
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("validateResetPassword")
  async forgotPassword(@Body() req: ValidateResteRequestDto) {
    return this.authService.validateResetPassword(req);
  }

  @Post("resetPassword")
  async resetPassword(@Body() req: UsernameRequestDto) {
    return this.authService.resetPassword(req.username);
  }
}
