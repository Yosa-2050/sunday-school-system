import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { PlanItem } from './entity/plan-item.entity';
import { PlanActivity } from './entity/plan-activity.entity';
import { Plan } from './entity/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Department } from '@shega/organization/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan, 
      PlanActivity, 
      PlanItem,
      Department
    ])
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
