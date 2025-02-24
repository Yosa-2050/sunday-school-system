import { User } from "src/users/entities/user.entity";

export class UserResponsePayload {
  constructor(user: User, getInfo: any) {
    (this.email = user.email),
      (this.sub = user.id),
      (this.role = user.roles.find((x) => x.isDefault)?.role),
      (this.pwdChangeRequired = user.pwd_change_required),
      (this.id = user.id),
      this.getMyBranchInfo = getInfo;
  }

  email: string;
  sub: string;
  role: string;
  pwdChangeRequired: boolean;
  id: string;
  getMyBranchInfo: any;
}
