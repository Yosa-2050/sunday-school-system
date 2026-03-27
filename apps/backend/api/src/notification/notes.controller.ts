import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotesService } from './notes.service';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Get('/:referenceId')
    getUserInAppNotifications(@Param('referenceId') referenceId: string) {
        return this.notesService.getNotesByReference(referenceId);
    }
}
