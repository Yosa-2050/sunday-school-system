export interface HomeroomAssignment {
    id: string;
    classId: string;
    teacherId: string;
    type: 'Head_Teacher' | 'Assistant_Teacher';
}

export type CreateHomeRoom = {
    classId: string;
    teacherId: string;
    type: 'Head_Teacher' | 'Assistant_Teacher';
};
export interface UpadteHomeRoom {
    classId?: string;
    teacherId?: string;
    type?: 'Head_Teacher' | 'Assistant_Teacher';
}
