// biome-ignore lint/style/useImportType: <explanation>
import { Permission } from '@shega/attendance/entities/permission.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Students } from '@shega/lms/entities/students.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { Gender } from '@shega/users/enums/profile-gender.enum';

export class GetAllPermission {
    constructor(entity: Students, permission: Permission) {
        this.studentId = entity.id;
        const pro = entity.profile;
        this.profileId = entity.profile?.id;
        this.fullName = `${pro.firstName} ${pro.middleName} ${pro.lastName ? pro.lastName : ''}`;
        this.gender = pro.gender;
        this.phoneNumber = pro.phoneNumber;
        this.idNumber = entity.idNumber;
        //this.group = entity.group;
        this.permissionId = permission.id;
        this.type = permission.type;
        this.value = permission.value;
    }

    studentId: string;
    phoneNumber: string;
    profileId: string;
    fullName: string;
    gender: Gender;
    idNumber: string;
    group: string;
    permissionId: string;
    type: string; //DateRange, schedule , specific date , day
    value: string;
}
