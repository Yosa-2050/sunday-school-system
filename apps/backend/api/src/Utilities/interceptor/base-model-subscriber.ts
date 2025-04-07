// biome-ignore lint/style/useImportType: <explanation>
import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ModuleRef } from '@nestjs/core';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from '@shega/auth/auth.service';
// biome-ignore lint/style/useImportType: <explanation>
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
// biome-ignore lint/style/useImportType: <explanation>
import { DateService } from '../date.service';
// biome-ignore lint/style/useImportType: <explanation>
import { BaseModel } from '../entities/base-model.entity';

@Injectable()
@EventSubscriber()
export class BaseModelSubscriber
    implements EntitySubscriberInterface<BaseModel>
{
    // constructor(
    //     private readonly dateService: DateService,
    //     private readonly clsService: ClsService, // To get current user
    // ) {}

    constructor(
        private readonly dataSource: DataSource,
        private readonly moduleRef: ModuleRef,
        private readonly dateService: DateService,
        private readonly authService: AuthService,
    ) {
        this.dataSource.subscribers.push(this);
    }

    beforeInsert(event: InsertEvent<BaseModel>) {
        const entity = event.entity;
        if (entity) {
            entity.createdAt = this.dateService?.getCurrentDate() ?? new Date();
            entity.updatedAt = this.dateService?.getCurrentDate() ?? new Date();

            const currentUser = this.authService?.CurrentUser();
            entity.createdBy = currentUser?.email || 'System';
            entity.updatedBy = currentUser?.email || 'System';
        }
    }

    beforeUpdate(event: UpdateEvent<BaseModel>) {
        const entity = event.entity;
        if (entity) {
            entity.updatedAt = this.dateService.getCurrentDate();

            const currentUser = this.authService.CurrentUser();
            entity.updatedBy = currentUser?.email || 'System';
        }
    }
}
