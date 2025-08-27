// biome-ignore lint/style/useImportType: <explanation>
import { Gender } from '@shega/users/enums/profile-gender.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { RelationShipsType } from '@shega/users/enums/relationship-type.enum';
import { IsEnum, IsString } from 'class-validator';

export class ImportStudentsRequest {
    @IsString()
    IdNumber: string;

    @IsString()
    FirstName: string;

    @IsString()
    MiddleName: string;

    @IsString()
    LastName: string;

    @IsEnum(Gender)
    Gender: Gender;

    @IsString()
    BirthYear: string;

    @IsString()
    ChristianName: string;

    @IsString()
    PhoneNumber: string;

    @IsString()
    SchoolName: string;

    @IsString()
    SchoolGrade: number;

    @IsString()
    Address: string;

    @IsString()
    EmergencyContact: string;

    @IsString()
    EmergencyContactPhone: string;

    @IsEnum(RelationShipsType)
    RelationshipType: RelationShipsType;
}
