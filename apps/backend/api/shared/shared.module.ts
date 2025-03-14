// shared.module.ts
import { Module } from "@nestjs/common";
import { QueryBuilderService } from "./query-builder.service";

@Module({
  providers: [QueryBuilderService],
  exports: [QueryBuilderService], // Export the service
})
export class SharedModule {}
