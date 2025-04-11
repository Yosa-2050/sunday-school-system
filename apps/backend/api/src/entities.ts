import { Document } from './document/entities/document.entity';
import { ApplicantSkills } from './job_portal/entities/applicants-skills.entity';
import { Applicants } from './job_portal/entities/applicants.entity';
import { Category } from './job_portal/entities/category.entity';
import { EducationHistory } from './job_portal/entities/educational-history.entity';
import { Experiance } from './job_portal/entities/experiance.entity';
import { JobApplication } from './job_portal/entities/job-application.entity';
import { JobCategory } from './job_portal/entities/job-category.entity';
import { JobDescription } from './job_portal/entities/job-description.entity';
import { JobSkills } from './job_portal/entities/job-skills.entity';
import { Jobs } from './job_portal/entities/jobs.entity';
import { Skills } from './job_portal/entities/skills.entity';
import { LocationInfo } from './location/entities/LocationInfo.entity';
import { ContactDetails } from './location/entities/contact-details.entity';
import { Country } from './location/entities/country.entity';
import { Location } from './location/entities/location.entity';
import { Notification } from './notification/entities/notification.entity';
import { NotificationTemplate } from './notification/entities/notificationTemplate.entity';
import { Branch } from './organization/entities/branch.entity';
import { EmployeeOrganization } from './organization/entities/employee-organization.entity';
import { Employee } from './organization/entities/employee.entity';
import { Organization } from './organization/entities/organization.entity';
import { Otp } from './users/entities/otp.entity';
import { Profile } from './users/entities/profile.entity';
import { UserRoles } from './users/entities/role.entity';
import { User } from './users/entities/user.entity';

export const AppEntities = [
    Organization,
    Branch,
    Employee,
    User,
    UserRoles,
    Profile,
    EmployeeOrganization,
    Otp,
    Document,
    ContactDetails,
    Location,
    Country,
    LocationInfo,
    Notification,
    Jobs,
    JobCategory,
    JobSkills,
    Category,
    Skills,
    Applicants,
    JobApplication,
    NotificationTemplate,
    ApplicantSkills,
    EducationHistory,
    Experiance,
    JobDescription,
];
