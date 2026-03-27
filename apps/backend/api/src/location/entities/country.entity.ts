import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
import { Continents } from '../enums/continents.enum';

@Entity()
export class Country extends BaseModel {
    @Column()
    name: string;

    @Column()
    continent: Continents;

    @Column({ unique: true })
    code: string;

    @Column({ unique: true })
    phoneCode: string;

    @Column()
    flag: string;

    //locationInfos: LocationInfo;
}
