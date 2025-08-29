import { Group } from './Utilities/entities/group.entity';
import { LookUps } from './Utilities/entities/lookups.entity';
import { Document } from './document/entities/document.entity';
import { CalendarYear } from './lms/entities/calendar-year.entity';
import { Classes } from './lms/entities/classes.entity';
import { ProgramUser } from './lms/entities/program-users.entity';
import { Program } from './lms/entities/program.entity';
import { RootClass } from './lms/entities/root-class.entity';
import { Students } from './lms/entities/students.entity';
import { LocationInfo } from './location/entities/LocationInfo.entity';
import { ContactDetails } from './location/entities/contact-details.entity';
import { Country } from './location/entities/country.entity';
import { Location } from './location/entities/location.entity';
import { Notes } from './notification/entities/notes.entity';
import { Notification } from './notification/entities/notification.entity';
import { NotificationTemplate } from './notification/entities/notificationTemplate.entity';
import { Otp } from './users/entities/otp.entity';
import { Profile } from './users/entities/profile.entity';
import { RelationShips } from './users/entities/relationships.entity';
import { UserRoles } from './users/entities/role.entity';
import { User } from './users/entities/user.entity';

export const AppEntities = [
    //Organization,
    //Branch,
    //Employee,
    User,
    UserRoles,
    Profile,
    //EmployeeOrganization,
    Otp,
    Document,
    ContactDetails,
    Location,
    Country,
    LocationInfo,
    Notification,
    //Jobs,
    //ProgramCategory,
    //ProgramSkills,
    //Category,
    //Skills,
    //Applicants,
    //Applications,
    NotificationTemplate,
    //ApplicantSkills,
    //EducationHistory,
    //Experience,
    //ProgramDescription,
    //Programs,
    //Mentors,
    //Mentorship,
    //SavedPrograms,
    LookUps,
    Notes,
    Program,
    Classes,
    Students,
    Group,
    CalendarYear,
    RootClass,
    RelationShips,
    ProgramUser,
];
