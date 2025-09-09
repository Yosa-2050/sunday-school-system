import { CommitmentType } from '@shega/education/enums/commitment-type.enum';
import { EducationalRequirementType } from '@shega/education/enums/education-requirement-type.enum';
import { EmploymentType } from '@shega/education/enums/employment-type.enum';
import { ExperienceLevelType } from '@shega/education/enums/experience-level-type.enum';
import { MentorshipType } from '@shega/education/enums/mentorship-type.enum';
import { SalaryFrequencyType } from '@shega/education/enums/salary-frequency-type.enum';
import { SalaryType } from '@shega/education/enums/salary-type.enum';
import { WorkPlaceType } from '@shega/education/enums/work-place-type.enum';
import { EmployeeType } from '@shega/organization/enums/employee-type.enum';
import { LoginBy } from './login-by.enum';
import { Gender } from './profile-gender.enum';
import { MarriageStatus } from './profile-marriage-status.enum';
import { Title } from './profile-title.enum';
import { RelationShipsType } from './relationship-type.enum';
import { UserRoleType } from './user-role.enum';

export const AllEnums = {
    LoginBy,
    UserRoleType,
    Gender,
    MarriageStatus,
    Title,
    EducationalRequirementType,
    EmployeeType,
    EmploymentType,
    SalaryFrequencyType,
    SalaryType,
    WorkPlaceType,
    CommitmentType,
    MentorshipType,
    ExperianceLevelType: ExperienceLevelType,
    RelationShipsType,
};
