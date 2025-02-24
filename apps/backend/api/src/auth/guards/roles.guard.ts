import {
    type CanActivate,
    type ExecutionContext,
    Injectable,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Reflector } from '@nestjs/core';
import type { UserRoleType } from 'src/users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    matchRoles(roles: string[], userRole: string) {
        return roles.some(
            (role) => role.toLowerCase() === userRole.toLowerCase(),
        );
    }

    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.getAllAndOverride<UserRoleType[]>(
            'roles',
            [context.getHandler(), context.getClass()],
        );

        if (!requireRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        return requireRoles.some(
            (role) => user?.role.toLowerCase() === role.toLowerCase(),
        );
    }
}
