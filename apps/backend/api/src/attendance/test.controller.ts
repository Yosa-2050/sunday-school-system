import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { Roles } from '@shega/auth/decorators/roles.decorator';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// biome-ignore lint/style/useImportType: <explanation>
import { TestRequestDto } from './dto/request/create-test.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { TestService } from './test.service';

@Roles(UserRoleType.SuperAdmin)
@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) {}

    @Roles(UserRoleType.SuperAdmin, UserRoleType.SchoolAdmin)
    @Post('')
    create(@Body() dto: TestRequestDto) {
        return this.testService.create(dto);
    }

    @Get()
    findAll() {
        return this.testService.findAll();
    }

    @Roles(UserRoleType.SuperAdmin, UserRoleType.SchoolAdmin)
    @Get('bySubjectId/:subjectId')
    findAllBySubjectId(@Param('subjectId') subjectId: string) {
        return this.testService.findBySubjectId(subjectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.testService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: TestRequestDto) {
        return this.testService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.testService.delete(id);
    }
}
