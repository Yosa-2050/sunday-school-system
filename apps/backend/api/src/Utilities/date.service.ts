import { Injectable, NotImplementedException } from '@nestjs/common';
import { CalanderEnum } from './enums/calander.enum';
import type { CustomDateModel } from './models/custom-date.model';

@Injectable()
export class DateService {
    getDate(model: CustomDateModel): string {
        if (model.type === CalanderEnum.Gregorian) {
            const date = new Date(
                Date.UTC(
                    model.year,
                    model.month,
                    model.day,
                    model.hour,
                    model.minute,
                    model.second,
                ),
            ).toUTCString();
            return date;
        }
        throw new NotImplementedException(model.type);
    }
    getCurrentDate() {
        return new Date();
    }

    getDateAfterByMinutes(minutes: number) {
        return new Date(this.getCurrentDate().getTime() + minutes * 60000);
    }
}
