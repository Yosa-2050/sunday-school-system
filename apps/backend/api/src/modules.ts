import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { JobPortalModule } from './job_portal/job_portal.module';
import { AddressModule } from './location/address.module';
import { NotificationModule } from './notification/notification.module';
import { OrganizationModule } from './organization/organization.module';
import { UsersModule } from './users/users.module';

export const AppModules = [
    UsersModule,
    AuthModule,
    OrganizationModule,
    NotificationModule,
    DocumentModule,
    AddressModule,
    JobPortalModule,
];
