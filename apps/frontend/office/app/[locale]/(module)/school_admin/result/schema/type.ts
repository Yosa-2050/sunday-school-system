import type { StudentByIdResponse } from '../../students/schemas/type';

export interface ResultRecord {
    studentId: string;
    score: number;
}

export interface ResultRequest {
    testId: string;
    result: ResultRecord[];
    selectedTest: string;
}

export interface ResultResponse {
    id: number;
    student: StudentByIdResponse;
    testId: string;
    score: number;
}
