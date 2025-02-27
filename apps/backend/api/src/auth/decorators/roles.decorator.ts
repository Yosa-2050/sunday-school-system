import { SetMetadata } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { UserRoleType } from '@shega/users/enums/user-role.enum';

export const Roles = (...roles: UserRoleType[]) => SetMetadata('roles', roles);
