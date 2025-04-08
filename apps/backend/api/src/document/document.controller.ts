import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { Express, Response } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from './document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('document')
@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Get()
    findAll() {
        return this.documentService.findAll();
    }

    @Get('reference/:id')
    findByReference(@Param('id') id: string) {
        return this.documentService.findDocumentsByReferenceId(id);
    }

    @Get(':id')
    async findOne(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Res() res: Response,
    ) {
        const response = await this.documentService.findOne(id);
        const byteArray = await response.file;
        res.set({
            'Content-Type': `${response.doc.fileType}`, // Change this based on your file type
            'Content-Disposition': `attachment; filename=${response.doc.fileName}`,
            'Content-Length': byteArray.length,
        });
        res.end(byteArray);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateDocumentDto: UpdateDocumentDto,
    ) {
        return this.documentService.update(id, updateDocumentDto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.documentService.remove(+id);
    }

    @Post('upload/:referenceId')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Param('referenceId') id: string,
    ) {
        return this.documentService.create(file, id);
    }
}
