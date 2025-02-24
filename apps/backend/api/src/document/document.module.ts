import { Module } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";
import { Document } from "./entities/document.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IDocumentInterface } from "./interface/document-service.interface";
import { CloudinaryImpl } from "./interface/implementations/cloudinary.impl";

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [DocumentController],
  providers: [DocumentService,
    {
      provide: IDocumentInterface,
      useClass: CloudinaryImpl
    }
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
