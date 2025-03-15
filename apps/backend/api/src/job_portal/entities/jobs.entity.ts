import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from "@shega/Utilities/enums/approval-type.enum";
import { EmployeeOrganization } from "@shega/organization/entities/employee-organization.entity";
import { Organization } from "@shega/organization/entities/organization.entity";
import { Column, Entity, ManyToOne } from "typeorm";
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from "../enums/employment-type.enum";

@Entity()
export class Jobs extends BaseModel {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  type: EmploymentType;

  @Column()
  salaryFrom: number;

  @Column()
  salaryTo: number;

  @Column()
  status: ApprovalType;

  @ManyToOne(() => Organization, { eager: true, nullable: false })
  organization: Organization;

  @ManyToOne(() => EmployeeOrganization, { eager: true, nullable: true })
  postedBy: EmployeeOrganization;
}
