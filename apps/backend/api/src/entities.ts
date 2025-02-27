import { Document } from './document/entities/document.entity';
import { Jobs } from './job_portal/entities/jobs.entity';
import { LocationInfo } from './location/entities/LocationInfo.entity';
import { ContactDetails } from './location/entities/contact-details.entity';
import { Country } from './location/entities/country.entity';
import { Location } from './location/entities/location.entity';
import { Notification } from './notification/entities/notification.entity';
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
];
