// biome-ignore lint/style/useImportType: <explanation>
import { Teacher } from '@shega/lms/entities/teacher.entity';

export class TeacherResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;

    constructor(teacher: Teacher, email: string) {
        this.id = teacher.id;
        this.firstName = teacher.profile.firstName;
        this.lastName = teacher.profile.lastName;
        this.isActive = teacher.isActive;
        this.email = email;
    }
}
