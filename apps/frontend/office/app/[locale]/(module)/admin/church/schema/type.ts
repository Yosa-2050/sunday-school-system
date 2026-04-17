export enum OrganizationType {
    church = 'Church',
    SundaySchool = 'Sunday School',
}

export type Church = {
    id: string;
    name: string;
    organizationType: OrganizationType;
    createdBy: string;
    createdAt: string;
};