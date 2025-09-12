export interface SubjectAssignmentResponse {
    id: string;
    subjectId: string;
    classId: string;
    teacherId?: string;
    subjectTitle: string;
    description?: string;
    teacherType?: string;
    className: string;
    subjectName: string;
    teacherName?: string;
}

export interface CreateSubjectAssignmentRequest {
    subjectId: string;
    classId: string;
    teacherId?: string;
    subjectTitle: string;
    description?: string;
    teacherType?: string;
}
