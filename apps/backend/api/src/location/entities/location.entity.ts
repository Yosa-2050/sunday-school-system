import { BaseModel } from '@shega/Utilities/entities/base-model.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ReferenceType } from '@shega/Utilities/enums/reference-type.enum';
import { Column, Entity } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
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
