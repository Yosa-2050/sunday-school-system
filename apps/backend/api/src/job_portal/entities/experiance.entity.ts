import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Applicants } from './applicants.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { EmploymentType } from '../enums/employment-type.enum';
import { Country } from '@shega/location/entities/country.entity';
import { LocationInfo } from '@shega/location/entities/LocationInfo.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { WorkPlaceType } from '../enums/work-place-type.enum';

@Entity()
export class Experiance extends BaseModel {
    @ManyToOne(() => Applicants, {
        eager: true,
        nullable: false,
    })
    applicant: Applicants;

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

    @ManyToOne(() => Country, { eager: true, nullable: true })
    country: Country;

    @ManyToOne(() => LocationInfo, { eager: true, nullable: true })
    state: LocationInfo;

    @ManyToOne(() => LocationInfo, { eager: true, nullable: true })
    city: LocationInfo;

    @Column({ nullable: true })
    workPlace: WorkPlaceType;
}
