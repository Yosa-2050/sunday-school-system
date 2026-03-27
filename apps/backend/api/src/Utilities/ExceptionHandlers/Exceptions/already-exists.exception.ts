import { BadRequestException } from '@nestjs/common';

export class EntityAlreadyExistsException extends BadRequestException {
    constructor(entityName: string, criteria?: string) {
        const criteriaStr = criteria
            ? typeof criteria === 'string'
                ? criteria
                : JSON.stringify(criteria)
            : '';

        super(
            `${entityName} exists ${criteriaStr ? ` with criteria: ${criteriaStr}` : ''}`,
        );
    }
}
