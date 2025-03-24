export enum UserRoleType {
    JobSeeker = 'JOB_SEEKER',
    Administrator = 'ADMINISTRATOR',
    WorkProvider = 'WORK_PROVIDER',
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
            retVal.url = 'https://portal.shega.heranitech.com';
            break;
        case UserRoleType.Administrator.toString():
            retVal.value = 'Administrator';
            retVal.url = 'https://office.shega.heranitech.com';
            break;
        case UserRoleType.WorkProvider.toString():
            retVal.value = 'Work provider';
            retVal.url = 'https://office.shega.heranitech.com';
            break;
    }
    return retVal;
}
