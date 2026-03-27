import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { Column, Entity } from 'typeorm';
import { AddressType } from '../enums/address-type.enums';

@Entity()
export class Location extends BaseModel {
    @Column()
    reference: string;

    @Column({ type: 'json', nullable: true })
    locationData: Record<string, string>;

    @Column()
    addressType: AddressType;

    @Column()
    isPreferred: boolean;

    @Column()
    referenceType: ReferenceType;
}
