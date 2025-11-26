export enum UserRoleType {
    SuperAdmin = 'SUPER_ADMIN',
    Administrator = 'ADMINISTRATOR',
    Student = 'STUDENT',
    SchoolAdmin = 'SCHOOL_ADMIN',
    ProgramAdmin = 'PROGRAM_ADMIN',
    Teacher = 'Teacher',
}
export function validateEmployeeRole(value: string): boolean {
    const validEmployee: string[] = [UserRoleType.Teacher];
    return validEmployee.includes(value);
}

export function UserRoleValue(value: string) {
    const retVal = {
        value: '',
        url: '',
    };
    switch (value) {
        case UserRoleType.Teacher.toString():
            retVal.value = 'Teacher';
            retVal.url = process.env.PORTAL_URL;
            break;
        case UserRoleType.Student.toString():
            retVal.value = 'Student';
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
        case UserRoleType.SchoolAdmin.toString():
            retVal.value = 'School Administrator';
            retVal.url = process.env.OFFICE_URL;
            break;
    }
    return retVal;
}
