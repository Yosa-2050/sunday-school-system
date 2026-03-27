import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
import { User } from '@shega/users/entities/user.entity';

export class UserDetails {
    organizationId?: string;
    employeeId?: string;
    employeeOrgId?: string;
    applicantId?: string;
    programs?: string[];
    classes?: string[];
    calendarYears?: string[];
    mentorId?: string;
    profileId: string;
    userId: string;
    email: string;
    organizationName?: string;
    organizationStatus?: ApprovalType;
}

export class UserResponsePayload {
    constructor(user: User, details: UserDetails) {
        this.email = user.email;
        this.userId = user.id;
        this.role = user.roles.find((x) => x.isDefault)?.role;
        this.pwdChangeRequired = user.pwd_change_required;
        this.id = user.id;
        this.details = details;
    }

    email: string;
    userId: string;
    allRoles: string[];
    role: string;
    pwdChangeRequired: boolean;
    id: string;
    details: UserDetails;
}
