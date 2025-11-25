import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { HomeRoomAssignmentDto } from '../dto/request/home-room.request.dto';
import { HomeroomAssignment } from '../entities/home-room.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { ClassService } from './class.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LmsService } from './lms.service';

@Injectable()
export class HomeRoomService {
    constructor(
        private classService: ClassService,
        private lmsService: LmsService,
        @InjectRepository(HomeroomAssignment)
        private homeRoomRepo: Repository<HomeroomAssignment>,
    ) {}

    async CreateHomeRoom(dto: HomeRoomAssignmentDto) {
        const homeRoom = this.homeRoomRepo.create(dto);
        const classes = await this.classService.findOne(dto.classId);
        const member = await this.lmsService.GetUserByIdOrThrow(dto.memberId);
        homeRoom.class = classes;
        homeRoom.member = member;
        return this.homeRoomRepo.save(homeRoom);
    }

    findClassesByCalendarId(yearId: string) {
        const home = this.homeRoomRepo.find({
            where: {
                class: {
                    calendarYear: { id: yearId },
                },
            },
            relations: {
                class: true,
            },
        });
    }

    UpdateHomeRoom(dto: HomeRoomAssignmentDto) {
        throw new Error('Method not implemented.');
    }
}
