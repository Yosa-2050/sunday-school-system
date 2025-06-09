import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { LookupSeederService } from '@shega/Utilities/service/lookup-seeder.service';

@ApiTags('lookup')
@Controller('lookup')
export class LookupController {
    constructor(private lookupService: LookupSeederService) {}

    @Get('/:group')
    findByGroup(@Param('group') group: string) {
        return this.lookupService.findByGroup(group);
    }

    @Get('/:group/:subGroup')
    findBySubGroup(
        @Param('group') group: string,
        @Param('subGroup') subGroup: string,
    ) {
        return this.lookupService.findByGroup(group, subGroup);
    }
}
