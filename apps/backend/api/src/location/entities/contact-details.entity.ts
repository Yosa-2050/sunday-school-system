import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { Column, Entity } from 'typeorm';
import { ContactType } from '../enums/contact-type.enums';
import { ContactDetailsType } from '../enums/contanct-details.type.enum';

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
