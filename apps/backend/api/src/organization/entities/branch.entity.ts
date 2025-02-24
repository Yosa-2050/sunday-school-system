import { BaseModel } from "src/Utilities/entities/base-model.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Organization } from "./organization.entity";
import { EmployeeOrganization } from "./employee-organization.entity";

@Entity()
export class Branch extends BaseModel {
  @Column()
  name: string;

  @Column()
  isMainBranch: boolean;

  @ManyToOne(() => Organization, { lazy: true })
  organization: Organization;

  @OneToMany(() => EmployeeOrganization, (employee) => employee.branch, {
    lazy: true,
  })
  employee: EmployeeOrganization[];

}
