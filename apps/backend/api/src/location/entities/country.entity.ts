import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { Continents } from '../enums/continents.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationInfo } from './LocationInfo.entity';

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
