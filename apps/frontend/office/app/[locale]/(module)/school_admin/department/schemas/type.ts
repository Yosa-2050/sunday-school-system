export type DepartmentResponse = {
    id: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    name: string;
};

export type CreateDepartment = {
    name: string;
};
