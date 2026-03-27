import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/request/login.dto';
import {
    PasswordResetDto,
    UsernameRequestDto,
} from './dtos/request/username.dto';
import { ValidateResetRequestDto } from './dtos/request/validate-reset.request.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './jwt-public';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginRequestDto })
    login(@Request() req) {
        return this.authService.login(
            req?.user,
            req?.body?.origin,
            req?.body?.role,
        );
    }

    @Public()
    @Post('validateResetPassword')
    forgotPassword(@Body() req: ValidateResetRequestDto) {
        return this.authService.validateResetPassword(req);
    }

    @Public()
    @Post('resetPassword')
    resetPassword(@Body() req: UsernameRequestDto) {
        return this.authService.resetPassword(req.username, req.origin);
    }

    @Public()
    @Post('changePassword')
    changePassword(@Body() req: PasswordResetDto) {
        return this.authService.ChangePassword(req);
    }
}
