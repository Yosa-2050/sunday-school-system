import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthLoginDto } from './dtos/auth.login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    validate(payload: AuthLoginDto) {
        return {
            userId: payload.userId,
            role: payload.role,
            details: payload.details,
        };
    }
}
