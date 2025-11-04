export interface ResultRecord {
    studentId: string;
    score: number;
}

export interface ResultRequest {
    testId: string;
    result: ResultRecord[];
}
