import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
import { Entity, ManyToOne } from "typeorm";
import { Event } from "./event.entity";
import { OrganizationMembers } from "@shega/organization/entities/organization-member.entity";

@Entity()
export class EventMember extends BaseModel {
  @ManyToOne(() => Event, { eager: true })
  event: Event;

  @ManyToOne(() => OrganizationMembers, { eager: true })
  member: OrganizationMembers;
}
