import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { Repository } from 'typeorm';
import { Notes } from './entities/notes.entity';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Notes)
        private notesRepo: Repository<Notes>,
    ) {}

    async create(referenceId: string, notes: string, type: string) {
        const note = this.notesRepo.create();
        note.note = notes;
        note.type = type;
        note.reference = referenceId;

        const noteSaved = await this.notesRepo.save(note);

        return UtilityServices.EnsureCreated(noteSaved?.id);
    }

    getNotesByReference(referenceId: string) {
        return this.notesRepo.findBy({ reference: referenceId });
    }
}
