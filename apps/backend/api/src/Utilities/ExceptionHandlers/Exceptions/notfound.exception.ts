import { BadRequestException } from '@nestjs/common';

export class EntityNotFoundException extends BadRequestException {
    constructor(entityName: string, criteria?: string) {
        const criteriaStr = criteria
            ? typeof criteria === 'string'
                ? criteria
                : JSON.stringify(criteria)
            : '';

        super(
            `${entityName} not found${criteriaStr ? ` with criteria: ${criteriaStr}` : ''}`,
        );
    }
}
