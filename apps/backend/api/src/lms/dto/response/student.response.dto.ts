import { Students } from '@shega/lms/entities/students.entity';
import { Gender } from '@shega/users/enums/profile-gender.enum';

export class StudentResponseDto {
    constructor(student: Students) {
        this.id = student.id;
        this.firstName = student.profile.firstName;
        this.middleName = student.profile.middleName;
        this.lastName = student.profile.lastName;
        this.idNumber = student.idNumber;
        this.isActive = student.isActive;
        this.gender = student.profile.gender;
        this.fullName = `${student.profile.firstName} ${student.profile.middleName} ${student.profile.lastName}`;
    }
    id: string;
    fullName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    idNumber: string;
    isActive: boolean;
    gender: Gender;
}
