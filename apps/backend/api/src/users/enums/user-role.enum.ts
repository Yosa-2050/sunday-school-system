export enum UserRoleType {
    SuperAdmin = 'SUPER_ADMIN',
    JobSeeker = 'JOB_SEEKER',
    Administrator = 'ADMINISTRATOR',
    WorkProvider = 'WORK_PROVIDER',
    Mentor = 'MENTOR',
    Student = 'STUDENT',
}
export function validateEmployeeRole(value: string): boolean {
    const validEmployee: string[] = [UserRoleType.JobSeeker];
    return validEmployee.includes(value);
}

export function UserRoleValue(value: string) {
    const retVal = {
        value: '',
        url: '',
    };
    switch (value) {
        case UserRoleType.JobSeeker.toString():
            retVal.value = 'Job Seeker';
            retVal.url = process.env.PORTAL_URL;
            break;
        case UserRoleType.Administrator.toString():
            retVal.value = 'Administrator';
            retVal.url = process.env.OFFICE_URL;
            break;
        case UserRoleType.SuperAdmin.toString():
            retVal.value = 'Administrator';
            retVal.url = process.env.OFFICE_URL;
            break;
        case UserRoleType.WorkProvider.toString():
            retVal.value = 'Work provider';
            retVal.url = process.env.OFFICE_URL;
            break;
        case UserRoleType.Mentor.toString():
            retVal.value = 'Mentor';
            retVal.url = process.env.OFFICE_URL;
            break;
    }
    return retVal;
}
