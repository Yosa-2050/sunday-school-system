import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { OrganizationMembers } from '@shega/organization/entities/organization-member.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { TeacherType } from '../enums/teacher-type.enums';
import { Classes } from './classes.entity';
import { Program } from './program.entity';

@Entity()
export class HomeroomAssignment extends BaseModel {
    @ManyToOne(() => Classes, { eager: true })
    class: Classes;

    @ManyToOne(() => OrganizationMembers, { eager: true, nullable: true })
    member: OrganizationMembers;

    @ManyToOne(() => Program, { eager: true, nullable: true })
    program: Program;

    @Column()
    type: TeacherType;
}
