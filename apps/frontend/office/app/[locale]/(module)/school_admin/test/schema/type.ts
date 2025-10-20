export interface TestResponse {
    id: string;
    name: string;
    description: string;
    type: string;
    weight: number;
    documentId?: string;
    isGroupAssignment: boolean;
    classId?: string;
}
