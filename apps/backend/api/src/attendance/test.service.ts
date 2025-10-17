import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm/repository/Repository';
import type { TestRequestDto } from './dto/request/create-test.request.dto';
import { Test } from './entities/test.entity';

@Injectable()
export class TestService {
    constructor(
        @InjectRepository(Test)
        private readonly testRepository: Repository<Test>,
    ) {}
    create(dto: TestRequestDto) {
        const test = this.testRepository.create(dto);
        return this.testRepository.save(test);
    }
    findAll() {
        return this.testRepository.find();
    }
    findOne(id: string) {
        return this.testRepository.findOne({ where: { id } });
    }
    update(id: string, dto: TestRequestDto) {
        return this.testRepository.update({ id }, dto);
    }
    delete(id: string) {
        return this.testRepository.delete({ id });
    }
}
