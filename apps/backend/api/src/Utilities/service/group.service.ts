import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityNotFoundException } from '../ExceptionHandlers/Exceptions/notfound.exception';
import { Group } from '../entities/group.entity';
import { UtilityServices } from './utility.services';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private categoryRepo: Repository<Group>,
    ) {}
    async createCategories(name: string) {
        const categoryExisting = await this.categoryRepo.findOneBy({
            name,
            isActive: true,
        });
        if (categoryExisting) {
            throw new BadRequestException('Category found with the name');
        }

        const category = this.categoryRepo.create();
        category.name = name;
        category.isRoot = true;
        category.hasChild = true;
        return this.categoryRepo.save(category);
    }

    async addCategoriesByParentId(id: string, name: string) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new EntityNotFoundException('Category');
        }

        const childCategory = this.categoryRepo.create();
        childCategory.name = name;
        childCategory.isRoot = false;
        childCategory.hasChild = false;
        childCategory.parent = category;
        return this.categoryRepo.save(childCategory);
    }

    async updateCategories(id: string, name: string) {
        await this.CheckIfCategoryIsInUse(id);

        const update = await this.categoryRepo.preload({
            id,
            name,
        });
        if (!update) {
            throw new EntityNotFoundException(typeof Group);
        }
        return this.categoryRepo.save(update);
    }

    async deleteCategories(id: string) {
        await this.CheckIfCategoryIsInUse(id);

        const deleted = await this.categoryRepo.delete(id);

        return UtilityServices.EnsureDeleted(deleted, id);
    }
    private async CheckIfCategoryIsInUse(id: string) {
        // const isReferencedJOb = await this.jobCategoryRepo.count({
        //     where: { category: { id } },
        // });
        // const isReferencedEdu = await this.educationHistory.count({
        //     where: { fieldOfStudy: { id } },
        // });
        // if (isReferencedJOb > 0 || isReferencedEdu > 0) {
        //     throw new BadRequestException(
        //         'category is in use and cannot be edited or deleted.',
        //     );
        // }
    }

    findCategories() {
        return this.categoryRepo.findBy({ isRoot: true });
    }

    findCategoryById(id: string) {
        return this.categoryRepo.findOneBy({ id });
    }

    async getCategoriesByParentId(id: string) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new EntityNotFoundException(typeof Group);
        }

        return category.child;
    }

    getListCategoriesByParentIds(list: string[]) {
        return this.categoryRepo.findBy({ parent: { id: In(list) } });
    }
}
