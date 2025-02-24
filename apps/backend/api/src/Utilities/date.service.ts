import { Injectable, NotImplementedException } from "@nestjs/common";
import { CustomDateModel } from "./models/custom-date.model";
import { CalanderEnum } from "./enums/calander.enum";

@Injectable()
export class DateService {
    getDate(model: CustomDateModel): String {
        if(model.type == CalanderEnum.Gregorian)
        {
            var date = new Date(Date.UTC(model.year, model.month, model.day, model.hour, model.minute, model.second)).toUTCString();
            return date;
        }
        throw new NotImplementedException(model.type);
    }
    getCurrentDate(){
        return new Date();
    }

    getDateAfterByMinutes(minutes: number){
        return new Date(this.getCurrentDate().getTime() + minutes * 60000);
    }
}