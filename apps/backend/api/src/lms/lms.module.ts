import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassController } from './controllers/classes.controller';
import { LmsController } from './controllers/lms.controller';
import { Classes } from './entities/classes.entity';
import { Students } from './entities/students.entity';
import { ClassService } from './services/class.service';
import { LmsService } from './services/lms.service';

@Module({
    imports: [TypeOrmModule.forFeature([Classes, Students])],
    controllers: [LmsController, ClassController],
    providers: [LmsService, ClassService],
})
export class LmsModule {}
