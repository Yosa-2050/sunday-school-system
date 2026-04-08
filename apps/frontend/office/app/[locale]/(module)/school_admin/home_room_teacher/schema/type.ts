import { OrganizationMemberList } from "app/[locale]/(module)/admin/members/schemas/type";

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

 export type MemberListItem = OrganizationMemberList & {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    id_number?: string | null;
};


export function getMemberName(member: MemberListItem) {
    const firstName = member.firstName ?? member.profile?.firstName ?? '';
    const middleName = member.middleName ?? member.profile?.middleName ?? '';
    const lastName = member.lastName ?? member.profile?.lastName ?? '';

    return `${firstName} ${middleName} ${lastName}`
        .replace(/\s+/g, ' ')
        .trim() || 'Unknown member';
}

export function getMemberInitials(member: MemberListItem) {
    const firstName = member.firstName ?? member.profile?.firstName ?? '';
    const middleName = member.middleName ?? member.profile?.middleName ?? '';
    const lastName = member.lastName ?? member.profile?.lastName ?? '';

    return `${firstName?.trim()?.[0] ?? ''}${middleName?.trim()?.[0] ?? lastName?.trim()?.[0] ?? ''}` || '?';
}

export function getMemberProfileId(member: MemberListItem) {
    return member.profile?.id ?? member.id ?? null;
}

