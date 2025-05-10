// src/common/decorators/optional-uuid.decorator.ts

import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export function OptionalUUID() {
    return applyDecorators(
        IsString(),
        IsUUID(),
        IsOptional(),
        Transform(({ value }) => (value === '' ? undefined : value)),
    );
}

export function OptionalEnum(enumType: object) {
    return applyDecorators(
        IsEnum(enumType),
        IsOptional(),
        Transform(({ value }) => (value === '' ? undefined : value)),
    );
}
