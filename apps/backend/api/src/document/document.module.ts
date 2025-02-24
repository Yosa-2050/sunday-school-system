import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { IDocumentInterface } from './interface/document-service.interface';
import { CloudinaryImpl } from './interface/implementations/cloudinary.impl';

@Module({
    imports: [TypeOrmModule.forFeature([Document])],
    controllers: [DocumentController],
    providers: [
        DocumentService,
        {
            provide: IDocumentInterface,
            useClass: CloudinaryImpl,
        },
    ],
    exports: [DocumentService],
})
export class DocumentModule {}
