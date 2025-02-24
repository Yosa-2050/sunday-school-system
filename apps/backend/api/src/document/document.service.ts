import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { Document } from "./entities/document.entity";
import { IDocumentInterface, IDocumentService } from "./interface/document-service.interface";

@Injectable()
export class DocumentService {
  constructor(@InjectRepository(Document) private repo: Repository<Document>,
  @Inject(IDocumentInterface) private readonly documentService: IDocumentService) {}

  async create(file: Express.Multer.File, referenceId: string) {
    
    var file_location = await this.documentService.upload(await this.convertFileToBase64(file));

    var document = this.repo.create({
      fileName: file.originalname,
      fileType: file.mimetype,
      filePath: file_location,
      fileSize: file.size,
      referenceId,
    });

    var doc = await this.repo.save(document);
    return doc.id;
  }

  findAll() {
    return `This action returns all document`;
  }

  async findOne(id: string) {
    var doc = await this.repo.findOneBy({ id });
    if (doc) return doc.filePath;
    return "";
  }


  async findDocumentsByReferenceId(referenceId: string): Promise<Document[]> {
    return this.repo.find({ where: { referenceId } });
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }

  async convertFileToBase64(file: Express.Multer.File): Promise<string> {
    try {
      if (!file.buffer) {
        throw new Error('File buffer is empty. Ensure Multer is configured correctly.');
      }
  
      // Convert the file buffer to Base64
      const base64String = file.buffer.toString('base64');
  
      // Include MIME type in Base64 string for compatibility
      const mimeType = file.mimetype; // Example: 'application/pdf' or 'image/jpeg'
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      throw error;
    }
  }
}
