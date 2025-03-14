// shared.module.ts
import { Global, Module } from "@nestjs/common";
import { QueryBuilderService } from "./query-builder.service";

@Global()
@Module({
  providers: [QueryBuilderService],
  exports: [QueryBuilderService], // Export the service
})
export class SharedModule {}
