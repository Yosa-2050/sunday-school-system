// biome-ignore lint/style/useImportType: <explanation>
import { FindOptionsWhere, Repository } from 'typeorm';
import { EntityNotFoundException } from '../ExceptionHandlers/Exceptions/notfound.exception';

export async function findOneByOrThrow<Entity>(
    repo: Repository<Entity>,
    where: FindOptionsWhere<Entity>,
): Promise<Entity> {
    const entity = await repo.findOneBy(where);
    if (!entity) {
        throw new EntityNotFoundException(typeof repo);
    }
    return entity;
}
