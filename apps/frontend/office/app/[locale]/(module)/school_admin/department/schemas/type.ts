export type DepartmentResponse = {
    id: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    name: string;
    description: string;
};

export type CreateDepartment = {
    name: string;
    description: string;
};
