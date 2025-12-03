import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { ProgramType } from '../enums/program-type.enums';

@Entity()
export class RootClass extends BaseModel {
    @Column()
    name: string;

    @Column({ nullable: true })
    programType: ProgramType;
}
