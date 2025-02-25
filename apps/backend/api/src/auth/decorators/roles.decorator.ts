import { SetMetadata } from '@nestjs/common';
import type { UserRoleType } from '@shega/users/enums/user-role.enum';

export const Roles = (...roles: UserRoleType[]) => SetMetadata('roles', roles);
