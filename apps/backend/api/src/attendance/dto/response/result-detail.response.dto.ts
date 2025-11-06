import type { Gender } from '@shega/users/enums/profile-gender.enum';

export class ResultDetailResponse {
    studentId: string;
    isStudentActive: boolean;
    idNumber: string;
    group: string;
    fullName: string;
    phoneNumber: string;
    gender: Gender;
    totals: number;
    attendance: {
        [testName: string]: number;
    };
}
