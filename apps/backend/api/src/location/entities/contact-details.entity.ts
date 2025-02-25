import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import type { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { Column, Entity } from 'typeorm';
import type { ContactType } from '../enums/contact-type.enums';
import type { ContactDetailsType } from '../enums/contanct-details.type.enum';

@Entity()
export class ContactDetails extends BaseModel {
    @Column()
    reference: string;

    @Column()
    type: ContactDetailsType;

    @Column()
    contactType: ContactType;

    @Column()
    value: string;

    @Column()
    isPreferred: boolean;

    @Column()
    referenceType: ReferenceType;
}
