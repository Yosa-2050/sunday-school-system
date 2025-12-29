export interface HomeroomAssignment {
    id: string;
    type: 'Main' | 'sub';

    class: {
        id: string;
        name: string;
    };

    member: {
        profile: {
            id: string;
            firstName: string;
            lastName: string;
        };
        type: string;
    };
}

export type CreateHomeRoom = {
    programId: string | null;
    classId: string | null;
    memberId: string | null;
    type: string | null;
};
export interface UpdateHomeRoom {
    classId?: string;
    memberId?: string;
    type?: 'Main' | 'sub';
}
