import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { LocationInfo } from '@shega/location/entities/LocationInfo.entity';
import { Country } from '@shega/location/entities/country.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '../enums/employment-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { WorkPlaceType } from '../enums/work-place-type.enum';
import { Qualification } from './qualification.entity';

@Entity()
export class Experience extends BaseModel {
    @ManyToOne(() => Qualification, {
        lazy: true,
        nullable: false,
    })
    applicant: Qualification;

    @Column()
    title: string;

    @Column()
    company: string;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    type: EmploymentType;

    @Column({ nullable: true })
    countryId: string;

    @ManyToOne(() => Country, { nullable: true })
    @JoinColumn({ name: 'countryId' })
    country: Country;

    @Column({ nullable: true })
    stateId: string;

    @ManyToOne(() => LocationInfo, { nullable: true })
    @JoinColumn({ name: 'stateId' })
    state: LocationInfo;

    @Column({ nullable: true })
    cityId: string;

    @ManyToOne(() => LocationInfo, { nullable: true })
    @JoinColumn({ name: 'cityId' })
    city: LocationInfo;

    @Column({ nullable: true })
    workPlace: WorkPlaceType;

    @Column({ nullable: true })
    description: string;
}
