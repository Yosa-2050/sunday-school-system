// src/common/decorators/optional-uuid.decorator.ts

import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export function OptionalUUID() {
  return applyDecorators(
    IsString(),
    IsUUID(),
    IsOptional(),
    Transform(({ value }) => (value === '' ? undefined : value)),
  );
}
