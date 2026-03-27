import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LookupService } from '@shega/Utilities/service/lookup-seeder.service';

@ApiTags('lookup')
@Controller('lookup')
export class LookupController {
    constructor(private lookupService: LookupService) {}

    @Get('/:group')
    findByGroup(@Param('group') group: string) {
        return this.lookupService.findByGroup(group);
    }

    @Get('byId/:id')
    findById(@Param('id') id: string) {
        return this.lookupService.findById(id);
    }

    @Get('byCode/:code')
    findByCode(@Param('code') code: string) {
        return this.lookupService.findByCode(code);
    }

    @Get('/:group/:subGroup')
    findBySubGroup(
        @Param('group') group: string,
        @Param('subGroup') subGroup: string,
    ) {
        return this.lookupService.findByGroup(group, subGroup);
    }
}
