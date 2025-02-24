import { BaseModel } from "src/Utilities/entities/base-model.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserRoleType } from "../enums/user-role.enum";
import { User } from "./user.entity";
import { SchemaNames } from "src/Utilities/enums/schema-names.enums";

@Entity()
export class UserRoles extends BaseModel {
  @Column()
  role: UserRoleType;

  @Column({ default: true })
  isDefault: boolean;

  @ManyToOne(() => User)
  user: User;
}
