import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/request/login.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UsernameRequestDto } from './dtos/request/username.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ValidateResteRequestDto } from './dtos/request/validate-reset.request.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './jwt-public';

@Controller('auth')
@Public()
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginRequestDto })
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('validateResetPassword')
    forgotPassword(@Body() req: ValidateResteRequestDto) {
        return this.authService.validateResetPassword(req);
    }

    @Post('resetPassword')
    resetPassword(@Body() req: UsernameRequestDto) {
        return this.authService.resetPassword(req.username);
    }
}
