export enum UserRoleType {
    JobSeeker = 'JOB_SEEKER',
    Administrator = 'ADMINISTRATOR',
    WorkProvider = 'WORK_PROVIDER',
}
export function validateEmployeeRole(value: string): boolean {
    const validEmployee: string[] = [UserRoleType.JobSeeker];
    return validEmployee.includes(value);
}
