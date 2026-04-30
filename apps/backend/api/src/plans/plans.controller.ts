import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto, UpdatePlanStatusDto } from './dto/update-plan.dto';

@Controller('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) {}

    @Post('create')
    create(@Body() dto: CreatePlanDto) {
        return this.plansService.create(dto);
    }

    @Get()
    findAll(
        @Query('departmentId') departmentId?: string,
        @Query('year') year?: string,
    ) {
        return this.plansService.findAll({
        departmentId,
        year: year ? Number(year) : undefined,
        });
  }

   @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.plansService.findOne(id);
    }

  @Put(':id')
  update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePlanDto,
    ) {
        return this.plansService.update(id, dto);
   }

   @Patch(':id/status')
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePlanStatusDto,
    ) {
        return this.plansService.UpdateStatus(id, dto)
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.plansService.remove(id);
    }
}
