import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "@shega/auth/jwt-public";
// biome-ignore lint/style/useImportType: <explanation>
import { LookupSeederService } from "@shega/Utilities/service/lookup-seeder.service";

@Public()
@ApiTags('lookup')
@Controller('lookup')
export class LookupController {
    constructor(
        private lookupService: LookupSeederService,
    ) {}

    @Get('/:group')
        findByGroup(@Param('group') group: string) {
            return this.lookupService.findByGroup(group);
        }

        @Get('/:group/:subGroup')
        findBySubGroup(@Param('group') group: string, @Param('subGroup') subGroup: string) {
            return this.lookupService.findByGroup(group, subGroup);
        }
}