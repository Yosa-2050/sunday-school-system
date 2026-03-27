import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { Students } from '@shega/lms/entities/students.entity';
import { StudentService } from '@shega/lms/services/student.service';
//import { EntityNotFoundException } from '@shega/Utilities/ExceptionHandlers/Exceptions/notfound.exception';
import { Repository } from 'typeorm/repository/Repository';
import {
    ResultForMultipleStudentRequestDto,
    ResultForSingleStudentRequestDto,
} from './dto/request/create-result.request.dto';
import { ResultDetailResponse } from './dto/response/result-detail.response.dto';
import { Result } from './entities/result.entity';
import { Test } from './entities/test.entity';

@Injectable()
export class ResultService {
    constructor(
        @InjectRepository(Students)
        private readonly studentRepository: Repository<Students>,
        @InjectRepository(Test)
        private readonly testRepository: Repository<Test>,
        @InjectRepository(Result)
        private readonly resultRepository: Repository<Result>,
        private readonly studentService: StudentService,
    ) {}

    async create(dto: ResultForSingleStudentRequestDto) {
        let result = this.resultRepository.create();
        result.score = dto.score; //creates empty result
        //checks for test id exists
        const test = await this.testRepository.findOneBy({ id: dto.testId });
        if (!test) {
            throw new EntityNotFoundException('Test');
        }
        //check if student exists
        //check if student class and test are same
        const student = await this.studentRepository.findOneBy({
            id: dto.studentId,
        });
        if (!student) {
            throw new EntityNotFoundException('student');
        }
        //check if result existed for student and test
        const existing = await this.findResultByStudentAndTest(
            dto.studentId,
            dto.testId,
        );
        if (existing) {
            result = existing; // if existed update
        } else {
            result.test = test;
            result.student = student; //if not existed insert
        }
        result.score = dto.score;

        //accept Result model and save.
        return await this.resultRepository.save(result);
    }

    async createMultiple(dto: ResultForMultipleStudentRequestDto) {
        const test = await this.testRepository.findOneBy({ id: dto.testId });
        if (!test) {
            throw new EntityNotFoundException('Test');
        }

        for (let index = 0; index < dto.result.length; index++) {
            const element = dto.result[index];
            const student = await this.studentRepository.findOneBy({
                id: element.studentId,
            });
            if (!student) {
                throw new EntityNotFoundException('student');
            }

            let result = this.resultRepository.create();

            const existing = await this.findResultByStudentAndTest(
                element.studentId,
                dto.testId,
            );
            if (existing) {
                result = existing;
            } else {
                result.test = test;
                result.student = student;
            }
            result.score = element.score;

            await this.resultRepository.save(result);
        }
        return UtilityServices.SuccessDataResponse();
    }

    async findOne(resultId: string) {
        return await this.resultRepository.findOneBy({
            id: resultId,
        });
    }

    async findResultByStudent(studentId: string) {
        return await this.resultRepository.findBy({
            student: { id: studentId },
        });
    }
    async findResultByTestId(testId: string) {
        return await this.resultRepository.findBy({
            test: { id: testId },
        });
    }

    async findResultByStudentAndTest(studentId: string, testId: string) {
        return await this.resultRepository.findOneBy({
            test: { id: testId },
            student: { id: studentId },
        });
    }

    async findAll() {
        await this.resultRepository.find();
    }

    async findAllResult(
        activeYear: string,
        classId: string,
        subjectId?: string,
        testId?: string,
    ) {
        const query = this.resultRepository
            .createQueryBuilder('result')
            .leftJoinAndSelect('result.student', 'student')
            .leftJoinAndSelect('result.test', 'test')
            .leftJoinAndSelect('test.subject', 'subject')
            .leftJoinAndSelect('student.class', 'classes')
            .leftJoinAndSelect('student.profile', 'profile')
            .where('classes.id = :classId', { classId });

        if (subjectId) {
            query.andWhere('subject.id = :subjectId', { subjectId });
        }

        if (testId) {
            query.andWhere('test.id = :testId', { testId });
        }

        const result = await query.getMany();

        const students = await this.studentService.findStudents(
            classId,
            activeYear,
        );
        const uniqueIds = students.map((item) => item.id);
        const resultList = uniqueIds
            .map((element) => {
                const results = result.filter((x) => x.student.id === element);
                const std = students.find((x) => x.id === element);
                const att = new ResultDetailResponse(std, results);
                if (att?.idNumber) {
                    return att;
                }
            })
            .filter((x) => x);
        return resultList;
    }
}
