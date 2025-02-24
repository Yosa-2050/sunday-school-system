import { BaseModel } from 'src/Utilities/entities/base-model.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Otp extends BaseModel {
    @Column()
    reference: string;

    @Column()
    code: string;

    @Column()
    expired: boolean;

    @Column()
    expiresAt: Date;
}
