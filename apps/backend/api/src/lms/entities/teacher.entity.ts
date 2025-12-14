import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { OrganizationMembers } from '@shega/organization/entities/organization-member.entity';
import { Entity, ManyToOne } from 'typeorm';
import { CalendarYear } from './calendar-year.entity';

@Entity()
export class Teacher extends BaseModel {
    @ManyToOne(() => OrganizationMembers, { eager: true })
    member: OrganizationMembers;

    @ManyToOne(() => CalendarYear, { lazy: true })
    year: CalendarYear;
}
