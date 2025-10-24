export type TestResponse = {
    createdAt: string | number | Date;
    subjectId: string;
    id: string;
    name: string;
    description: string;
    type: string;
    weight: number;
    documentId?: string;
    isGroupAssignment: boolean;
    classId?: string;
};

export type CreateTestRequest = {
    subjectId: string;
    name: string;
    description?: string;
    type: string;
    weight: number;
    isGroupAssignment: boolean;
    classId?: string;
};
