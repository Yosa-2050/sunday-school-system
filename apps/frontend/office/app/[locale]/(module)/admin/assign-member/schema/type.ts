export type AssignMemberList = {
    departmentId: string;
    subDepartmentId?: string;
    memberId: string;
    position?: string;
    startDate?: string;
    endDate?: string;
};

export type DepartmentMemberResponse = {
    departmentName: string;
    subDepartmentName: string;
    memberName: string;
    position: string;
    startDate: string | null;
    endDate: string | null;
};

export enum DepartmentMemberPosition {
    CHAIR_PERSON = 'Chairperson',
    VICE_CHAIR_PERSON = 'ViceChairperson',
    SECRETARY = 'Secretary',
}

export const POSITION_OPTIONS = [
    { value: DepartmentMemberPosition.CHAIR_PERSON, label: 'Chairperson' },
    {
        value: DepartmentMemberPosition.VICE_CHAIR_PERSON,
        label: 'Vice Chairperson',
    },
    { value: DepartmentMemberPosition.SECRETARY, label: 'Secretary' },
];
