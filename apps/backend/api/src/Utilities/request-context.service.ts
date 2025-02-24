// src/request-context/request-context.service.ts

import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { CurrentUser } from "./current-user.utility";
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  getEmployeeId(): string {
    return CurrentUser.getEmployeeId(this.request.user);
  }
  getBranchId() {
    return CurrentUser.getBranchId(this.request.user);
  }
  getOrganizationId(): string {
    return CurrentUser.getOrganizationId(this.request.user);
  }
  private readonly contextMap: Map<string, any> = new Map();

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  set<T>(key: string, value: T): void {
    this.contextMap.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.contextMap.get(key) as T;
  }

  getRequest(): Request {
    return this.request;
  }

  getReportedById(){
    return CurrentUser.getReportedById(this.request.user);
  }
}
