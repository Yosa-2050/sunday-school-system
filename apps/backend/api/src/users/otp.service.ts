import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateService } from 'src/Utilities/date.service';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp) private repo: Repository<Otp>,
        @Inject(DateService) private dateService: DateService,
    ) {}

    CreateOtp(reference: string) {
        const otp = this.repo.create();
        otp.expired = false;
        otp.reference = reference;
        otp.expiresAt = this.dateService.getDateAfterByMinutes(5);
        otp.code = this.generateOtp();
        this.repo.save(otp);
        return otp.code;
    }

    async validateOtp(reference: string, code: string) {
        const otp = await this.repo.findOneBy({
            reference,
            code,
            expired: false,
        });
        if (otp && this.dateService.getCurrentDate() < otp.expiresAt) {
            otp.expired = true;
            this.repo.update(otp.id, otp);
            return true;
        }
        return false;
    }

    generateOtp(length = 6): string {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }
}
