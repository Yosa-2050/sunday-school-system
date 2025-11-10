// biome-ignore lint/style/useImportType: <explanation>
import { Result } from '@shega/attendance/entities/result.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { StudentResponseDto } from '@shega/lms/dto/response/student.response.dto';
import type { Gender } from '@shega/users/enums/profile-gender.enum';

export class ResultDetailResponse {
    constructor(student: StudentResponseDto, result: Result[]) {
        this.studentId = student.id;
        this.isStudentActive = student.isActive;
        this.idNumber = student.idNumber;
        this.fullName = student.fullName;
        this.gender = student.gender;
        this.totals = result.reduce((sum, item) => sum + item.score, 0);
    }
    studentId: string;
    isStudentActive: boolean;
    idNumber: string;
    fullName: string;
    gender: Gender;
    totals: number;
    results: {
        [testName: string]: number;
    };
}
