export enum UserRoleType {
    JobSeeker = 'JOB_SEEKER',
    ADMINISTRATOR = 'ADMINISTRATOR',
}
export function validateEmployeeRole(value: string): boolean {
    const validEmployee: string[] = [UserRoleType.JobSeeker];
    return validEmployee.includes(value);
}
