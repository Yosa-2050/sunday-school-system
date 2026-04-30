import { Department } from "@shega/organization/entities/department.entity";
import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { PlanStatus } from "../enum/plan-status-enum";
import { PlanActivity } from "./plan-activity.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Plan extends BaseModel {
    @Column()
    year: number;

    @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.DRAFT,
  })
  status: PlanStatus;

    @ManyToOne(() => Department, (department) => department.plans, {eager: true})
    department: Department;


    @OneToMany(() => PlanActivity, (activity) => activity.plan, {
    cascade: true,
    eager: true,
  })
  activities: PlanActivity[];
} 