export interface HomeroomAssignment {
    id: string;
    type: 'Main' | 'sub';

    class: {
        id: string;
        name: string;
    };

    programUser: {
        member: {
            profile: {
                id: string;
                firstName: string;
                lastName: string;
            };
            type: string;
        };
    };
}

export type CreateHomeRoom = {
    classId: string;
    memberId: string;
    type: string | null;
};
export interface UpadteHomeRoom {
    classId?: string;
    memberId?: string;
    type?: 'Main' | 'sub';
}
