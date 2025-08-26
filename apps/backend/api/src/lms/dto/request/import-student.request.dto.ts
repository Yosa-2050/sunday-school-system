// biome-ignore lint/style/useImportType: <explanation>
import { Gender } from '@shega/users/enums/profile-gender.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { RelationShipsType } from '@shega/users/enums/relationship-type.enum';
import { IsString } from 'class-validator';

export class ImportStudentsRequest {
    @IsString()
    IdNumber: string;
    @IsString()
    FirstName: string;
    @IsString()
    MiddleName: string;
    @IsString()
    lastName: string;
    gender: Gender;
    birthYear: number;
    @IsString()
    baptistName: string;
    @IsString()
    phoneNumber: string;
    @IsString()
    schoolName: string;
    @IsString()
    schoolGrade: number;
    @IsString()
    address: string;
    @IsString()
    emergencyContact: string;
    @IsString()
    emergencyContactPhone: string;
    relationShipType: RelationShipsType;
}
