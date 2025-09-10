import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { Profile } from '@shega/users/entities/profile.entity';
import { Entity, ManyToOne } from 'typeorm';
import { CalendarYear } from './calendar-year.entity';

@Entity()
export class Teacher extends BaseModel {
    @ManyToOne(() => Profile, { eager: true, cascade: true })
    profile: Profile;

    @ManyToOne(() => CalendarYear, { lazy: true })
    year: CalendarYear;
}
