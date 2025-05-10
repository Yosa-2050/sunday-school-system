import { BadRequestException } from '@nestjs/common';

export class EntityOperationNotAllowedException extends BadRequestException {
    constructor(entityName: string, criteria?: string) {
        const criteriaStr = criteria
            ? // biome-ignore lint/nursery/noNestedTernary: <explanation>
              typeof criteria === 'string'
                ? criteria
                : JSON.stringify(criteria)
            : '';

        super(
            `Operation not allowed on ${entityName} ${criteriaStr ? ` with criteria: ${criteriaStr}` : ''}`,
        );
    }
}
