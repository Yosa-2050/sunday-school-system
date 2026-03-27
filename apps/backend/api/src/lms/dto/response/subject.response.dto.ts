import { SubjectAssignment } from '@shega/lms/entities/subject-assignment.entity';

export class SubjectResponseDto {
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
    teachers: string[];

    constructor(subject: SubjectAssignment) {
        this.id = subject.id;
        this.subjectId = subject.subject.id;
        this.subjectName = subject.subject.name;
        this.subjectTitle = subject.subjectTitle;
        this.description = subject.description;
    }
}
