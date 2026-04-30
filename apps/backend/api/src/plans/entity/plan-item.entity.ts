import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PlanActivity } from "./plan-activity.entity";

@Entity()
export class PlanItem extends BaseModel{

  @Column()
  itemNumber: string;

  @Column()
  activityName: string;
  
  @Column()
  unit: string;

  @Column('int', { default: 0 })
  quantity: number;

  @Column('decimal', { default: 0 })
  budget: number;

  @Column("simple-array", { nullable: true })
  months: boolean[];

  @ManyToOne(() => PlanActivity, (planActivity) => planActivity.items, {
    onDelete: 'CASCADE',
  })
  parentActivity: PlanActivity;
}
