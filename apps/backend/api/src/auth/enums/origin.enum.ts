import { BadRequestException } from '@nestjs/common';
import { UserRoleType } from '@shega/users/enums/user-role.enum';

export enum OriginEnums {
    portal = 'portal',
    office = 'office',
}

export function validateRole(role: UserRoleType, origin: OriginEnums): boolean {
    const portalRoles: UserRoleType[] = [UserRoleType.JobSeeker];
    const officeRoles: UserRoleType[] = [
        UserRoleType.Administrator,
        UserRoleType.SuperAdmin,
        UserRoleType.WorkProvider,
    ];
    if (origin === OriginEnums.office) {
        return officeRoles.includes(role);
    }
    if (origin === OriginEnums.portal) {
        return portalRoles.includes(role);
    }
    throw new BadRequestException('Origin not found');
}
