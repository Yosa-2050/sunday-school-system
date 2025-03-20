// biome-ignore lint/style/useImportType: <explanation>
import { User } from "@shega/users/entities/user.entity";

export class GetPaginatedUsersResponseDto {
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  id: string;

  constructor(user: User) {
    if (user?.profile) {
      this.id = user.id;
      this.fullName = `${user.profile?.firstName ?? ""} ${user.profile?.middleName ?? ""} ${user.profile?.lastName}`;
      this.email = user.email;
      this.role = user.roles[0]?.role; //TODO: selecting only one role.
      this.isActive = user.isActive;
      this.createdBy = user.createdBy;
      this.createdDate = user.createdAt?.toISOString();
    }
  }
}
