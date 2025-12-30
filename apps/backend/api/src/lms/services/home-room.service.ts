import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from '@shega/users/users.service';
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
        private userService: UsersService,
    ) {}

    async CreateHomeRoom(dto: HomeRoomAssignmentDto) {
        const homeRoom = this.homeRoomRepo.create(dto);
        const program = await this.lmsService.findOneProgram(dto.programId);
        const classes = await this.classService.findOne(dto.classId);
        const member = await this.lmsService.GetUserByMemberIdOrThrow(
            dto.memberId,
        );
        homeRoom.class = classes;
        homeRoom.member = member;
        homeRoom.program = program;
        const result = await this.homeRoomRepo.save(homeRoom);
        await this.userService.addRole(
            member.profile.id,
            UserRoleType.HomeRoom,
        );
        return result;
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
                member: {
                    profile: true,
                },
            },
        });

        return home;
    }

    UpdateHomeRoom(dto: HomeRoomAssignmentDto) {
        throw new Error('Method not implemented.');
    }
}
