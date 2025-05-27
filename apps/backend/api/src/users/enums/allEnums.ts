import { DocumentType } from '@shega/document/enums/document-type.enums';
import { CommitmentType } from '@shega/job_portal/enums/commitment-type.enum';
import { EducationalRequirmentType } from '@shega/job_portal/enums/education-requirment-type.enum';
import { EmploymentType } from '@shega/job_portal/enums/employment-type.enum';
import { ExperianceLevelType } from '@shega/job_portal/enums/experiance-level-type.enum';
import { MentorshipType } from '@shega/job_portal/enums/mentorship-type.enum';
import { SalaryFrequencyType } from '@shega/job_portal/enums/salary-frequency-type.enum';
import { SalaryType } from '@shega/job_portal/enums/salary-type.enum';
import { WorkPlaceType } from '@shega/job_portal/enums/work-place-type.enum';
import { EmployeeType } from '@shega/organization/enums/employee-type.enum';
import { LoginBy } from './login-by.enum';
import { Gender } from './profile-gender.enum';
import { MarriageStatus } from './profile-marriagestatus.enum';
import { Title } from './profile-title.enum';
import { UserRoleType } from './user-role.enum';

export const AllEnums = {
    LoginBy,
    UserRoleType,
    Gender,
    MarriageStatus,
    Title,
    EducationalRequirmentType,
    EmployeeType,
    EmploymentType,
    SalaryFrequencyType,
    SalaryType,
    WorkPlaceType,
    CommitmentType,
    MentorshipType,
    ExperianceLevelType,
    DocumentType,
};
