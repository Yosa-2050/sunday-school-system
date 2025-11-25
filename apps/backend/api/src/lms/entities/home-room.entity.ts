import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { TeacherType } from '../enums/teacher-type.enums';
import { Classes } from './classes.entity';
import { ProgramUser } from './program-users.entity';

@Entity()
export class HomeroomAssignment extends BaseModel {
    @ManyToOne(() => Classes, { eager: true })
    class: Classes;

    @ManyToOne(() => ProgramUser, { eager: true })
    programUser: ProgramUser;

    @Column()
    type: TeacherType;
}
