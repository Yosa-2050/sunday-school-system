import { BaseModel } from "@shega/Utilities/entities/base-model.entity";
import { ManyToOne } from "typeorm";
import { Event } from "./event.entity";
import { OrganizationMembers } from "@shega/organization/entities/organization-member.entity";

export class EventMember extends BaseModel {
    @ManyToOne(() => Event, {eager: true})
    event: Event;

     @ManyToOne(() => OrganizationMembers, {eager: true})
    member: OrganizationMembers;

}