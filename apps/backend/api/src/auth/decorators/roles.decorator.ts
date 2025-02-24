import { SetMetadata } from '@nestjs/common';
import type { UserRoleType } from 'src/users/enums/user-role.enum';

export const Roles = (...roles: UserRoleType[]) => SetMetadata('roles', roles);
