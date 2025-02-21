import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
    @Get()
    getHello(): string {
        return 'created';
    }
}
