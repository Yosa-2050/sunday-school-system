import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Plan } from "./plan.entity";
import { PlanItem } from "./plan-item.entity";


@Entity()
export class PlanActivity extends BaseModel {
  @Column()
  activityNumber: string;
 
  @Column()
  name: string;
 
  @ManyToOne(() => Plan, (plan) => plan.activities, {
    onDelete: 'CASCADE',
  })
  plan: Plan;
 
  @OneToMany(() => PlanItem, (item) => item.parentActivity, {
    cascade: true,
    eager: true,
  })
  items: PlanItem[];
}