import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { RelationShipsType } from '../enums/relationship-type.enum';
import { Profile } from './profile.entity';

@Entity()
export class RelationShips extends BaseModel {
    @ManyToOne(() => Profile)
    profile1: Profile;

    @ManyToOne(() => Profile)
    profile2: Profile;

    @Column()
    type: RelationShipsType;

    @Column()
    isParent: boolean;

    @Column()
    isEmergency: boolean;
}
