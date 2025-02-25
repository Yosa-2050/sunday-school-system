// @shega/request-context/request-context.service.ts

import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
// import { CurrentUser } from './current-user.utility';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService<T> {
    getEmployeeId(): string {
        return '';
        // return CurrentUser.getEmployeeId(this.request.user);
    }
    // getBranchId() {
    //     return CurrentUser.getBranchId(this.request.user);
    // }
    getOrganizationId(): string {
        return '';

        // return CurrentUser.getOrganizationId(this.request.user);
    }
    private readonly contextMap: Map<string, T> = new Map();

    constructor(@Inject(REQUEST) private readonly request: Request) {}

    set(key: string, value: T): void {
        this.contextMap.set(key, value);
    }

    get(key: string): T | undefined {
        return this.contextMap.get(key) as T;
    }

    getRequest(): Request {
        return this.request;
    }

    getReportedById() {
        return '';

        // return CurrentUser.getReportedById(this.request.user);
    }
}
