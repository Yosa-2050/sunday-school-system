import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { IDocumentInterface } from './interface/document-service.interface';
import { SeaweedFsService } from './interface/implementations/seaweed-s3-service.imp';
// import { CloudinaryImpl } from './interface/implementations/cloudinary.impl';

@Module({
    imports: [TypeOrmModule.forFeature([Document])],
    controllers: [DocumentController],
    providers: [
        DocumentService,
        {
            provide: IDocumentInterface,
            useClass: SeaweedFsService,
        },
    ],
    exports: [DocumentService],
})
export class DocumentModule {}
