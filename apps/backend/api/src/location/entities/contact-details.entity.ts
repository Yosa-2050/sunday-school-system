import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { Column, Entity } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { ContactType } from '../enums/contact-type.enums';
// biome-ignore lint/style/useImportType: <explanation>
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
