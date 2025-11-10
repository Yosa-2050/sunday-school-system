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

export interface ResultViewResponse {
    id: string;
    studentId: string;
    fullName: string;
    idNumber: string;
    results?: {
        [testName: string]: number;
    };
    totals: number;
}
