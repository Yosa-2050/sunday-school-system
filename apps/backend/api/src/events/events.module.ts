import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceModule } from '@shega/attendance/attendance.module';
import { DocumentModule } from '@shega/document/document.module';
import { OrganizationModule } from '@shega/organization/organization.module';
import { Event } from './entity/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventMember } from './entity/event-member.entity';
import { OrganizationMembers } from '@shega/organization/entities/organization-member.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Event, 
            EventMember, 
            OrganizationMembers
        ]),
        DocumentModule,
        AttendanceModule,
        OrganizationModule,
    ],
    providers: [EventsService],
    controllers: [EventsController],
    exports: [EventsService],   
})
export class EventsModule {}
