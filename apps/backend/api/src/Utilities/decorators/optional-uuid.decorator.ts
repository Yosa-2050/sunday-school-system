// src/common/decorators/optional-uuid.decorator.ts

import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export function OptionalUUID() {
    return applyDecorators(
        IsString(),
        IsUUID(),
        IsOptional(),
        Transform(({ value }) => (value === '' ? undefined : value)),
    );
}
