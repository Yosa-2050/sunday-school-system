import { StudentResponse } from "../../students/schemas/type";

export type NotificationResponse = {
    success: boolean;
    message: string;
};


export function getStudentName(student: StudentResponse) {
    return (
        student.fullName ||
        `${student.firstName} ${student.middleName} ${student.lastName}`
            .replace(/\s+/g, ' ')
            .trim()
    );
}

export function getStudentInitials(student: StudentResponse) {
    return (
        `${student.firstName?.[0] ?? ''}${student.middleName?.[0] ?? student.lastName?.[0] ?? ''}` ||
        '?'
    );
}