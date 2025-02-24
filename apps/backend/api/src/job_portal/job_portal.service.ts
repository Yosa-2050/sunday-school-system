import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateJobPortalDto } from './dto/create-job_portal.dto';
import { UpdateJobPortalDto } from './dto/update-job_portal.dto';

@Injectable()
export class JobPortalService {
    create(createJobPortalDto: CreateJobPortalDto) {
        return 'This action adds a new jobPortal';
    }

    findAll() {
        throw new NotImplementedException();
    }

    findOne(id: number) {
        throw new NotImplementedException();
    }

    update(id: number, updateJobPortalDto: UpdateJobPortalDto) {
        throw new NotImplementedException();
    }

    remove(id: number) {
        throw new NotImplementedException();
    }
}
