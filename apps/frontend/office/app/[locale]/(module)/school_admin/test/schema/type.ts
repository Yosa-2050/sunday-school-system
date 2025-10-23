export type TestResponse = {
    id: string;
    name: string;
    description: string;
    type: string;
    weight: number;
    documentId?: string;
    isGroupAssignment: boolean;
    classId?: string;
};

export type CreateTest = {
    name: string;
};
