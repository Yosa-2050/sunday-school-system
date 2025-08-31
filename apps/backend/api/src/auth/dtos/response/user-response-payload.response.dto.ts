// biome-ignore lint/style/useImportType: <explanation>
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { User } from '@shega/users/entities/user.entity';

export class UserDetails {
    organizationId?: string;
    employeeId?: string;
    employeeOrgId?: string;
    applicantId?: string;
    programId?: string;
    calendarYear?: string;
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
    role: string;
    pwdChangeRequired: boolean;
    id: string;
    details: UserDetails;
}
