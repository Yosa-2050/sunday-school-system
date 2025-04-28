import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationType } from '../enums/location-type.enums';
import { Country } from './country.entity';

@Entity()
export class LocationInfo extends BaseModel {
    @Column()
    name: string;

    @Column()
    type: LocationType;

    @ManyToOne(() => LocationInfo, { lazy: true, nullable: true })
    parent: LocationInfo;

    @OneToMany(
        () => LocationInfo,
        (child) => child.parent,
        {
            lazy: true,
            cascade: true,
        },
    )
    childs: LocationInfo[];

    @ManyToOne(() => Country, { lazy: true, nullable: true })
    country: Country;

    @Column()
    isRoot: boolean;
}
