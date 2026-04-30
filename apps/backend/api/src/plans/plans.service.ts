import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entity/plan.entity';
import { Not, Repository } from 'typeorm';
import { PlanActivity } from './entity/plan-activity.entity';
import { PlanItem } from './entity/plan-item.entity';
import { Department } from '@shega/organization/entities/department.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto, UpdatePlanStatusDto } from './dto/update-plan.dto';
import { PlanStatus } from './enum/plan-status-enum';

@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepo: Repository<Plan>,

         @InjectRepository(PlanActivity)
        private readonly activityRepo: Repository<PlanActivity>,

         @InjectRepository(PlanItem)
        private readonly itemRepo: Repository<PlanItem>,

         @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,
    ) {}


    async create( dto: CreatePlanDto): Promise<Plan> {
        const department = await this.departmentRepo.findOne({
            where: { id: dto.departmentId },
        });

        if (!department) {
            throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);
        }

        const existing = await this.planRepo.findOne({
            where: {
                department: { id: dto.departmentId }, year: dto.year
            },
        });

        if (existing) {
            throw new NotFoundException(`Plan for department ${dto.departmentId} and year ${dto.year} already exists`);
        }

        const plan = this.planRepo.create({
            year: dto.year,
            status: dto.status ?? PlanStatus.DRAFT,
            department,
        });

        plan.activities = dto.activities.map((activityDto) => {
            const activity = this.activityRepo.create({
                activityNumber: activityDto.activityNumber,
                name: activityDto.name,
            });

            activity.items = activityDto.items.map((itemDto) => {
              return  this.itemRepo.create({
                    itemNumber: itemDto.itemNumber,
                    activityName: itemDto.activityName,
                    unit: itemDto.unit,
                    quantity: itemDto.quantity,
                    budget: itemDto.budget,
                    months: itemDto.months,
                });
                

            })
            return activity;
        });

        return this.planRepo.save(plan);
    }

     async findAll(filters?: { departmentId?: string; year?: number }): Promise<Plan[]> {
    const res = this.planRepo
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.department', 'department')
      .leftJoinAndSelect('plan.activities', 'activity')
      .leftJoinAndSelect('activity.items', 'item')
      .orderBy('plan.createdAt', 'DESC');

    if (filters?.departmentId) {
      res.andWhere('department.id = :departmentId', {
        departmentId: filters.departmentId,
      });
    }

    if (filters?.year) {
      res.andWhere('plan.year = :year', { year: filters.year });
    }

    return res.getMany();
  }


 async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepo
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.department', 'department')
      .leftJoinAndSelect('plan.activities', 'activity')
      .leftJoinAndSelect('activity.items', 'item')
      .where('plan.id = :id', { id })
      .getOne();

    if (!plan) {
      throw new NotFoundException(`Plan with id "${id}" not found`);
    }

    return plan;
  }

async update(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const plan  = await this.findOne(id); 

    if (dto.departmentId && dto.departmentId !== plan.department.id) {
        const department = await this.departmentRepo.findOne({
            where: { id: dto.departmentId },
        });
        if (!department) {
            throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);
        }
        plan.department = department;
    }

     if (dto.year !== undefined) {
        plan.year = dto.year
    };
    if (dto.status !== undefined) {
        plan.status = dto.status;
    }

    
    if (dto.activities !== undefined) {
      plan.activities = dto.activities.map((actDto) => {
        const activity = this.activityRepo.create({
          activityNumber: actDto.activityNumber,
          name: actDto.name,
        });

        activity.items = actDto.items.map((itemDto) =>
         this.itemRepo.create({
            itemNumber: itemDto.itemNumber,
            activityName: itemDto.activityName,
            unit: itemDto.unit ?? '',
            quantity: itemDto.quantity,
            budget: itemDto.budget,
            months: itemDto.months,
          }),
        );

        return activity;
      });
    }

    return this.planRepo.save(plan);
  }

  async UpdateStatus(id: string, dto: UpdatePlanStatusDto): Promise<Plan> {
    const plan = await this.findOne(id);
    plan.status = dto.status;
    return this.planRepo.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    await this.planRepo.remove(plan);
  }

}
