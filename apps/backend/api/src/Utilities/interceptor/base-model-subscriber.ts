// biome-ignore lint/style/useImportType: <explanation>
import { Injectable, OnModuleInit } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    DataSource,
} from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { BaseModel } from '../entities/base-model.entity';
import { DateService } from '../date.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ModuleRef } from '@nestjs/core';
import { AuthService } from '@shega/auth/auth.service';

@Injectable()
@EventSubscriber()
export class BaseModelSubscriber
    implements EntitySubscriberInterface<BaseModel>, OnModuleInit
{
    // constructor(
    //     private readonly dateService: DateService,
    //     private readonly clsService: ClsService, // To get current user
    // ) {}

    private dateService: DateService;
    private authService: AuthService;

    constructor(
        private readonly dataSource: DataSource,
        private readonly moduleRef: ModuleRef,
    ) {
        this.dataSource.subscribers.push(this);
    }

    onModuleInit() {
        // Retrieve DateService manually
        this.dateService = this.moduleRef.get(DateService, { strict: false });
        this.authService = this.moduleRef.get(AuthService, { strict: false });
    }

    beforeInsert(event: InsertEvent<BaseModel>) {
        const entity = event.entity;
        if (entity) {
            entity.createdAt = this.dateService.getCurrentDate();
            entity.updatedAt = this.dateService.getCurrentDate();

            const currentUser = this.authService.CurrentUser();
            entity.createdBy = currentUser.email || 'System';
            entity.updatedBy = currentUser.email || 'System';
        }
    }

    beforeUpdate(event: UpdateEvent<BaseModel>) {
        const entity = event.entity;
        if (entity) {
            entity.updatedAt = this.dateService.getCurrentDate();

            const currentUser = this.authService.CurrentUser();
            entity.updatedBy = currentUser.email || 'System';
        }
    }
}
